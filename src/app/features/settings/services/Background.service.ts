import {Injectable, signal} from '@angular/core';

export type AppBackground = 'dark' | 'light' | 'funny';

@Injectable({
    providedIn: 'root'
})
export class BackgroundService {
    readonly background = signal<AppBackground>('dark');

    toggleTheme(background: AppBackground) {
        this.background.set(background);
    }
}
