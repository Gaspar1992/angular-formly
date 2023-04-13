import { Component, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FormlyModule } from './formly';
import { JsonPipe, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [ReactiveFormsModule, FormlyModule, NgIf, MatButtonModule, JsonPipe, RouterOutlet],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent {}
