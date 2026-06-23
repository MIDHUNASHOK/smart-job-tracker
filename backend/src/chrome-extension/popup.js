const API_BASE_URL =
  'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', () => {

  checkLoginStatus();

  document
    .getElementById('loginBtn')
    .addEventListener('click', loginUser);

  document
    .getElementById('saveJob')
    .addEventListener('click', saveJob);

  document
    .getElementById('logoutBtn')
    .addEventListener('click', logoutUser);

});

function showMessage(text, type = 'success') {

  const message =
    document.getElementById('message');

  message.innerText = text;

  if (type === 'success') {
    message.style.color = 'green';
  } else if (type === 'error') {
    message.style.color = 'red';
  } else {
    message.style.color = 'orange';
  }

}

function checkLoginStatus() {

  chrome.storage.local.get(
    ['nextzielToken', 'nextzielUser'],
    (result) => {

      if (result.nextzielToken) {

        showJobSection(result.nextzielUser);

        extractLinkedInJobDetails();

      } else {

        showLoginSection();

      }

    }
  );

}

function showLoginSection() {

  document
    .getElementById('loginSection')
    .classList.remove('hidden');

  document
    .getElementById('jobSection')
    .classList.add('hidden');

}

function showJobSection(user) {

  document
    .getElementById('loginSection')
    .classList.add('hidden');

  document
    .getElementById('jobSection')
    .classList.remove('hidden');

  document.getElementById('userInfo').innerText =
    `Logged in as ${user?.fullName || 'NextZiel User'}`;

}

async function loginUser() {

  const email =
    document.getElementById('email').value.trim();

  const password =
    document.getElementById('password').value.trim();

  if (!email || !password) {

    showMessage(
      'Email and password are required',
      'error'
    );

    return;

  }

  try {

    const response =
      await fetch(`${API_BASE_URL}/auth/login`, {

        method: 'POST',

        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          email,
          password
        })

      });

    const result =
      await response.json();

    if (!result.success) {

      showMessage(
        result.message || 'Login failed',
        'error'
      );

      return;

    }

    chrome.storage.local.set(
      {
        nextzielToken: result.token,
        nextzielUser: result.user
      },
      () => {

        showMessage(
          'Login successful',
          'success'
        );

        showJobSection(result.user);

        extractLinkedInJobDetails();

      }
    );

  } catch (error) {

    console.log(error);

    showMessage(
      'Backend connection failed',
      'error'
    );

  }

}

async function extractLinkedInJobDetails() {

  const [tab] =
    await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

  chrome.tabs.sendMessage(
    tab.id,
    {
      action: 'GET_JOB_DETAILS'
    },
    (response) => {

      if (chrome.runtime.lastError || !response) {

        showMessage(
          'Open a LinkedIn job page to auto-fill details',
          'warning'
        );

        return;

      }

      document.getElementById('jobTitle').value =
        response.jobTitle || '';

      document.getElementById('companyName').value =
        response.companyName || '';

      document.getElementById('location').value =
        response.location || '';

      document.getElementById('jobUrl').value =
        response.jobUrl || '';
        checkAlreadySaved();

    }
  );

  

}

function saveJob() {

  chrome.storage.local.get(
    ['nextzielToken'],
    async (result) => {

      const token =
        result.nextzielToken;

      if (!token) {

        showMessage(
          'Please login first',
          'error'
        );

        return;

      }

      const jobData = {

        job_Title:
          document.getElementById('jobTitle').value.trim(),

        company_Name:
          document.getElementById('companyName').value.trim(),

        location:
          document.getElementById('location').value.trim(),

        job_Type:
          'Not specified',

        work_mode:
          'Not specified',

        status:
          'Applied',

        applied_Date:
          new Date().toISOString(),

        job_Url:
          document.getElementById('jobUrl').value.trim(),

        notes:
          'Saved from Chrome Extension'

      };

      if (
        !jobData.job_Title ||
        !jobData.company_Name
      ) {

        showMessage(
          'Job title and company are required',
          'error'
        );

        return;

      }

      try {

        const response =
          await fetch(`${API_BASE_URL}/jobs/create`, {

            method: 'POST',

            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },

            body: JSON.stringify(jobData)

          });

        const saveResult =
          await response.json();

        if (saveResult.success) {

          const saveBtn =
    document.getElementById('saveJob');

  saveBtn.disabled = true;
  saveBtn.innerText = 'Already Saved';
          showMessage(
            'Job saved successfully',
            'success'
          );

        } else {

          showMessage(
            saveResult.message || 'Failed to save job',
            'error'
          );

        }

      } catch (error) {

        console.log(error);

        showMessage(
          'Backend connection failed',
          'error'
        );

      }

    }
  );

}

function logoutUser() {

  chrome.storage.local.remove(
    ['nextzielToken', 'nextzielUser'],
    () => {

      showMessage(
        'Logged out successfully',
        'success'
      );

      showLoginSection();

    }
  );

}

async function checkAlreadySaved() {

  chrome.storage.local.get(
    ['nextzielToken'],
    async (result) => {

      const token =
        result.nextzielToken;

      const jobUrl =
        document.getElementById('jobUrl').value.trim();

      if (!token || !jobUrl) {
        return;
      }

      const response =
        await fetch(
          `${API_BASE_URL}/jobs/check?jobUrl=${encodeURIComponent(jobUrl)}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

      const data =
        await response.json();

      const saveBtn =
        document.getElementById('saveJob');

      if (data.saved) {

        saveBtn.disabled = true;
        saveBtn.innerText = 'Already Saved';

        showMessage(
          'This job is already saved in NextZiel',
          'warning'
        );

      } else {

        saveBtn.disabled = false;
        saveBtn.innerText = 'Save Job';

      }

    }
  );

}