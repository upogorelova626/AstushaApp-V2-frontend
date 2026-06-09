import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'repositoryName'
})
export class RepositoryNamePipe implements PipeTransform {
    transform(url: string): string {
        const normalizedUrl = url
            .trim()
            .replace(/^https?:\/\//i, '')
            .replace(/^www\./i, '');

        const parts = normalizedUrl.split('/').filter(Boolean);

        return parts.at(-1) ?? normalizedUrl;
    }
}
