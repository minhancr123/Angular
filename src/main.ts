import { enableProdMode, importProvidersFrom } from '@angular/core';

import { environment } from './environments/environment';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app/app-routing.module';
import { AppComponent } from './app/app.component';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { CustomLoadTranslate } from './app/_core/loaders/custom-translate-loader';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { JeeSearchFormService } from './app/shared/components/jee-search-form-1/jee-search-form.service';
import { DatePipe } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/_core/interceptors/auth.interceptor';
import { MatFormFieldModule } from '@angular/material/form-field';
import { loggingInterceptor } from './app/modules/logging/logging.interceptor';

// 👇 Hàm tạo loader cho i18n
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    DatePipe,
    JeeSearchFormService, 
    importProvidersFrom(
      BrowserModule,
      AppRoutingModule,
      BrowserAnimationsModule,
      HttpClientModule,
      MatFormFieldModule,
MatSnackBarModule ,
 MatDatepickerModule,
    MatNativeDateModule,
      // 👇 Thêm dòng này để cấu hình i18n
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useClass: CustomLoadTranslate,
        },
        defaultLanguage: 'vi' // hoặc 'en'
      })
    ),
    provideAnimations(),
    
        provideHttpClient(withInterceptors([authInterceptor])),

  ]
}).catch((err) => console.error(err));

