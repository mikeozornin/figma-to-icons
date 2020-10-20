# Установка необходимого ПО
1. Установить brew ([http://brew.sh/index_ru.html](http://brew.sh/index_ru.html)):
`/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)`

2. С помощью brew установить шрифтообработчики:
`brew install ttfautohint fontforge`

3. Установить node.js, скачать [https://nodejs.org/en/](https://nodejs.org/en/) тут current-версию.

4. Установить grunt
`sudo npm install -g grunt-cli`
Команда выполняется под sudo. Вас спросят пароль, это пароль локального пользователя

# Сборка
Выполнить команды:
`npm install`
`grunt`