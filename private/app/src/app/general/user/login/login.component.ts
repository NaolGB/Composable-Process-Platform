import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  callerMessage: string | null = null;
  errorMessage: string | null = null;
  authService = inject(AuthService);

  rawLoginForm = this.formBuilder.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(private activatedRouter: ActivatedRoute, private router: Router, private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.activatedRouter.queryParams.subscribe(params => {
      this.callerMessage = params['callerMessage'];
    });
  }

  onSubmit(): void {
    console.log('submitting form');
    const rawLoginFormValue = this.rawLoginForm.value;
    this.authService
      .login(rawLoginFormValue.email!, rawLoginFormValue.password!)
      .subscribe(
      () => {
        this.router.navigate(['/design/master-data-type']);
      },
      (error) => {
        this.errorMessage = error.code;
      }
    );
  }

  onKeyboardChange(event: KeyboardEvent) {
    this.callerMessage = null
  }

}
