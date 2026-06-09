import {AbstractControl, ValidationErrors} from '@angular/forms';

const REPOSITORY_URL_PATTERN =
    /^(https?:\/\/)?(www\.)?(github\.com|gitlab\.com|bitbucket\.org)\/[\w.-]+(\/[\w.-]+)+\/?$/i;

export function repositoryUrlValidator(
    control: AbstractControl<string | null>
): ValidationErrors | null {
    const value = control.value?.trim();

    if (!value) {
        return null;
    }

    return REPOSITORY_URL_PATTERN.test(value) ? null : {repositoryUrl: true};
}
