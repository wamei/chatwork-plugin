import $ from 'jquery';
import * as Settings from '../feature/settings.js';

export default class IgnoreButton {
    static get notifier_on() {
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gYbATo7edivqwAAAepJREFUWMPtl7FLJDEUxn/jbiNYXSeCYOF4cAhbKQFBsJBtlRVtrpAThS2t8idMZSt3CHaCIFgqFguCMCCKBwcH5uAK4bgFK2FhQZDYvGKYTdZRZ2caHwzJhJf3vSTfey8JrLWUKUOULKU7QJlHYK2lmlU5jOJxYAmYAaaAEWkBboGOtJfAsdHqLovdwFpLEAT9gFeBTWDhlQtsAT+MVof9dsDrQBjFNeC7rPg9cglsGa1+uhwY8qz6G3CVAzhi40psvhwFYRRvA3tAJUe+VYA9se3nQBjFC8BZzuBJeQIWjVatHg6EUTwM/AHGBhx9/4BJo1U3zYFGAeAIRsPFga+eCefArHzn7xjHhZVMRDWP8prRqi0cWQP+v3EcF1ZyBz71YXAefVxYSRL+BSYcyqfAuvT3gfobx5PSNlqNpmtBC3Ali7pnG187npRr1xHsFFgIj3ocMFr9Bo4LAL8FDnypuAncDxD8UaLk0emAhM8y0B0Q+Hq6KjrLcRjFdeAkR/AOsGK0Os1UjmVCnoT7nAZ3ZcKkLHkqWdYq2RXgXaNV3E/R50AjVb02JE/MAfPAODCdmnMH/AJi4MJolWkXezggV7Eb+T0AmkarhyJvxasSiltGq4HnhaonXL4Yre4pQsp+mAQfj9OyHXgGDUPJfoJO3VAAAAAASUVORK5CYII=';
    }
    static get notifier_off() {
        return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3gYbATkg2JA1hAAAAdxJREFUWMPtl7FLHUEQxn+nNgGrdCEgpAgJSMAqaQKCDOG1yhNtLERRsMwfkjZEBDshELCMhI8HgiCIwYAQkEAKIShYCcIDQTbNFMe93eep9+4aB47dW2bnm939ZmY3CyHQpAzRsDTuAE0eQQiBkbLKZjYGTANvgVfAqLcAJ8CVtwfAtqTTMnazEAJZlvUDngNWgKk7LrADrEv62m8Hkg6Y2QTwxVf8EDkAViX9ijkwlFj1EnBYAThu49Bt3h4FZvYR2ACGK+TbMLDhttMcMLMp4EfF4Hm5AT5I6vRwwMyeAH+A5wOOvn/AS0ndIgfaNYDjGO0YBxYSE3aBd/7tPmCcGFY+EU0klOclnTtH5oGze44Tw8rvwNM+DK6iTwwrT8K/wIuI8g6w6P1NoHXP8bycS3pWrAUdIJYsWoltvOt4Xn7GjuBTjYXwW48Dkn4D2zWAnwBbqVS8BlwMEPzao+Q66oCHzwzQHRD4YrEqRsuxmbWA7xWCXwGzknZKlWOfUCXhXhfBY5kwL9OJSla2SnYd+LOk/X6KKQfaheq17HniPTAJjAFvCnNOgWNgH9iTVGoXezjgV7Ej/90C1iRd1nkrnvNQXJU08LwwkgiXcUkX1CFNP0yyx8dp0w78B5WJzMv8p27yAAAAAElFTkSuQmCC';
    }

    constructor(rid) {
        this.rid = rid;
        this.$el = $('<img style="cursor:pointer;position:relative;background:transparent;border:none;box-shadow:none;" class="_showDescription w_notifier w_'+rid+'" data-rid="'+rid+'" width="14px" height="14px" aria-label="通知機能のON/OFFが行えます">');

        let list = Settings.get('w-ignored-room-list', []);
        if(list.indexOf(rid) != -1){
            this.$el.attr('src', IgnoreButton.notifier_off);
        }else{
            this.$el.attr('src', IgnoreButton.notifier_on);
        }
    }

    render() {
        return this.$el;
    }
};
