import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  createJob(payload: any): Observable<any> {

    return this.http.post(

      `${this.apiUrl}/jobs/create`,

      payload

    );

  }


  getAllJobs(): Observable<any> {

    return this.http.get(

      `${this.apiUrl}/jobs`

    );

  }

  updateJob(
    id: string,
    payload: any
  ): Observable<any> {
  
    return this.http.put(
  
      `${this.apiUrl}/jobs/${id}`,
  
      payload
  
    );
  
  }

  deleteJob(id: string) {

    return this.http.delete(
  
      `${this.apiUrl}/jobs/${id}`
  
    );
  
  }

}