import {expect, test} from '@playwright/test';

const appUrl = 'http://localhost:4200';

test.describe('Create account page', () => {
    test('should send correct create account payload', async ({page}) => {
        const uniqueValue = Date.now();

        const user = {
            login: `test-user-${uniqueValue}`,
            email: `test-user-${uniqueValue}@mail.com`,
            password: '12345678'
        };

        await page.goto(`${appUrl}/auth/create-account`);

        const createAccountRequestPromise = page.waitForRequest(request => {
            return (
                request.method() === 'POST' &&
                request.url().includes('/auth/create-account')
            );
        });

        await page.getByPlaceholder('Введите логин').fill(user.login);
        await page
            .getByPlaceholder('Введите адрес электронной почты')
            .fill(user.email);
        await page.getByPlaceholder('Придумайте пароль').fill(user.password);
        await page.getByPlaceholder('Повторите пароль').fill(user.password);

        await page.locator('.register-card__checkbox').check();

        await page.getByRole('button', {name: 'Создать аккаунт'}).click();

        const createAccountRequest = await createAccountRequestPromise;

        expect(createAccountRequest.postDataJSON()).toEqual({
            login: user.login,
            email: user.email,
            password: user.password
        });
    });
});
