import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  callerMessage: string | null = null;

  constructor(private router: ActivatedRoute) { }

  ngOnInit() {
    console.log('Login Component');
    this.router.queryParams.subscribe(params => {
      this.callerMessage = params['callerMessage'];
      console.log(this.callerMessage);
    });
  }

}
