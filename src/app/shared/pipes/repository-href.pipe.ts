import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'repositoryHref'
})
export class RepositoryHrefPipe implements PipeTransform {
    transform(url: string): string {
        const trimmedUrl = url.trim();

        return /^https?:\/\//i.test(trimmedUrl)
            ? trimmedUrl
            : `https://${trimmedUrl}`;
    }
}
