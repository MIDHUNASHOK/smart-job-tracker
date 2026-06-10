import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-under-construction',
  templateUrl: './under-construction.component.html',
  styleUrl: './under-construction.component.scss'
})
export class UnderConstructionComponent {
  @Input() title: string =
  'Feature Under Development';

@Input() description: string =
  'We are working hard to bring this feature soon.';

}
