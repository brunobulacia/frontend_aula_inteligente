import { NgModule } from '@angular/core';
import { AuthModule } from './auth/auth.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [AuthModule, ReactiveFormsModule],
  declarations: [],
})
export class AppModule {}
