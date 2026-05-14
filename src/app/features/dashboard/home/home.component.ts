import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  statsCards = [

    {
      title: 'Total Applications',
      value: 128,
      growth: '12%',
      type: 'positive',
      icon: 'briefcase',
      color: 'blue'
    },
  
    {
      title: 'Interviews',
      value: 32,
      growth: '8%',
      type: 'positive',
      icon: 'people',
      color: 'purple'
    },
  
    {
      title: 'Offers',
      value: 6,
      growth: '20%',
      type: 'positive',
      icon: 'award',
      color: 'green'
    },
  
    {
      title: 'Rejections',
      value: 90,
      growth: '5%',
      type: 'negative',
      icon: 'x-circle',
      color: 'red'
    },
  
    {
      title: 'Pending',
      value: 60,
      growth: '8%',
      type: 'warning',
      icon: 'hourglass-split',
      color: 'yellow'
    }
  
  ];
}
