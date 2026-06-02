import {
    ChangeDetectionStrategy,
    Component,
    inject,
    signal
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
    ActivatedRouteSnapshot,
    NavigationEnd,
    Router,
    RouterLink
} from '@angular/router';
import {TuiItem} from '@taiga-ui/cdk';
import {TuiLink} from '@taiga-ui/core';
import {TuiBreadcrumbs} from '@taiga-ui/kit';
import {filter} from 'rxjs';

interface Breadcrumb {
    label: string;
    url: string;
}

@Component({
    selector: 'app-breadcrumbs',
    imports: [RouterLink, TuiBreadcrumbs, TuiItem, TuiLink],
    templateUrl: './breadcrumbs.component.html',
    styleUrl: './breadcrumbs.component.less',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BreadcrumbsComponent {
    private readonly router = inject(Router);

    protected readonly breadcrumbs = signal<Breadcrumb[]>([]);

    constructor() {
        this.setBreadcrumbs();

        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd),
                takeUntilDestroyed()
            )
            .subscribe(() => {
                this.setBreadcrumbs();
            });
    }

    private setBreadcrumbs() {
        this.breadcrumbs.set(
            this.buildBreadcrumbs(this.router.routerState.snapshot.root)
        );
    }

    private buildBreadcrumbs(
        route: ActivatedRouteSnapshot,
        url = '',
        breadcrumbs: Breadcrumb[] = []
    ): Breadcrumb[] {
        const children = route.children;

        if (!children.length) {
            return breadcrumbs;
        }

        for (const child of children) {
            const routeUrl = child.url.map(segment => segment.path).join('/');
            const nextUrl = routeUrl ? `${url}/${routeUrl}` : url;
            const label = child.data['breadcrumb'];

            if (label) {
                breadcrumbs.push({
                    label,
                    url: nextUrl || '/'
                });
            }

            return this.buildBreadcrumbs(child, nextUrl, breadcrumbs);
        }

        return breadcrumbs;
    }
}
