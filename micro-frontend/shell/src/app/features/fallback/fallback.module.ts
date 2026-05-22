import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Component } from '@angular/core';

@Component({
  selector: 'app-fallback',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="fallback-container">
      <mat-card class="fallback-card">
        <mat-card-content>
          <div class="fallback-content">
            <mat-icon class="fallback-icon">cloud_off</mat-icon>
            <h2>Service Temporarily Unavailable</h2>
            <p>This micro-frontend service is currently offline or not running.</p>
            <p class="hint">Make sure all MFE services are running on their respective ports.</p>
            <button mat-raised-button color="primary" (click)="retry()">
              <mat-icon>refresh</mat-icon>
              Retry
            </button>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .fallback-container {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 48px 24px;
    }
    .fallback-card {
      max-width: 480px;
      width: 100%;
      border-radius: 12px !important;
    }
    .fallback-content {
      text-align: center;
      padding: 32px 0;
    }
    .fallback-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #9e9e9e;
      margin-bottom: 16px;
    }
    h2 { font-size: 22px; font-weight: 700; color: #424242; margin: 0 0 12px; }
    p { color: #757575; margin: 0 0 8px; }
    .hint { font-size: 12px; color: #9e9e9e; margin-bottom: 24px; }
    button { mat-icon { margin-right: 6px; } }
  `]
})
export class FallbackComponent {
  retry(): void { window.location.reload(); }
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '**', component: FallbackComponent }])
  ],
  declarations: [],
})
export class FallbackModule {}
