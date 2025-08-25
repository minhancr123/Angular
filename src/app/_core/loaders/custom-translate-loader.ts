import { TranslateLoader, TranslationObject } from "@ngx-translate/core";

import { Observable , of } from "rxjs";

import { locale } from "src/assets/i18n/vi";

export class CustomLoadTranslate extends TranslateLoader{
    override getTranslation(lang: string): Observable<any> {
        if(lang == "vi"){
            return of(locale.data);
        }
         return of({});
    }
}