'use strict'
let xhr = new XMLHttpRequest();
xhr.open('GET', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=0e8a6538b291d291d144eeb9f1a49801', true);
xhr.send();
function enter() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        let usersArr = JSON.parse(xhr.responseText)
        let flag1 = true
        for (let i in usersArr) {
            if (usersArr[i].login == login.value && usersArr[i].password != password.value) {
                flag1 = false
                alert("Неверный пароль")
                break
            }
            if (usersArr[i].login == login.value && usersArr[i].password == password.value) {
                flag1 = false
                localStorage.setItem('status', usersArr[i].status)
                localStorage.setItem('enterSeabattle', 1)
                localStorage.setItem('login', login.value)
                localStorage.setItem('nickname', usersArr[i].nickname)
                alert("Вы успешно вошли в аккаунт")
                window.location.href = 'index3.html';
                break
            }
        }
        if (flag1 == true) {
            alert("Такого аккаунта не существует")
        }
    }
}
function register() {
    if (xhr.readyState == 4 && xhr.status == 200) {
        let usersArr = JSON.parse(xhr.responseText)
        let user = {
            nickname: '',
            login: '',
            password: '',
            status: 'user'
        }
        if (nickname.value == "" || login.value == "" || password.value == "") {
            alert("Все поля должны быть заполнены")
        } else {
            let flag1 = true
            for (let i in usersArr) {
                if (usersArr[i].login == login.value) {
                    flag1 = false
                    alert("Данный логин уже занят")
                    break
                }
            }
            if (flag1 == true) {
                user.nickname = nickname.value
                user.login = login.value
                user.password = password.value
                nickname.value = ""
                login.value = ""
                password.value = ""
                usersArr.push(user)
                let xhrSender = new XMLHttpRequest();
                xhrSender.open('PUT', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=0e8a6538b291d291d144eeb9f1a49801', true)
                xhrSender.setRequestHeader("Content-type", "application/json");
                xhrSender.send(JSON.stringify(usersArr));
                xhrSender.addEventListener('readystatechange', function () {
                    if (xhrSender.readyState == 4) {
                        if (xhrSender.status == 200) {
                            alert('Пользователь успешно зарегестрирован!');
                        } else {
                            alert('Ошибка отправки. Попробуйте еще раз.');
                        }
                    }
                })
            }
        }
    }
}
if (localStorage.getItem("enterSeabattle") == 0 && (document.title == "Rules" || document.title == "Fields")) {
    window.location.href = 'index.html';
}
if (localStorage.getItem('enterSeabattle') == 1 && document.title == "Registration") {
    window.location.href = 'index3.html';
}
if (localStorage.getItem('enterGame') == 1 && document.title != "Game") {
    localStorage.setItem('correct', 0)
    localStorage.setItem('gameStarted', 0)
    localStorage.setItem('startClicked', 0)
    window.location.href = 'index7.html';
}

if (localStorage.getItem('enterSeabattle') == 1 && (document.title == "Fields" || document.title == "Rules")) {
    let templateCode = `
        <ul>
            <a href="index3.html">Поля</a>
            <a href="index4.html">Правила</a>
            <button class="exitButton" id="exitButton">Выйти</button>
        </ul>
    `
    let template = Handlebars.compile(templateCode);
    let head = document.querySelector('#header');
    head.innerHTML = '';
    head.innerHTML = template()
    exitButton.addEventListener('click', function () {
        localStorage.setItem('enterSeabattle', 0)
        window.location.href = 'index2.html';
    })
}

if (document.title == "Registration") {
    registrationButton.addEventListener('click', function () {
        register()
    })
    document.addEventListener('keydown', function (e) {
        if (e.key == "Enter") {
            register()
        }
    })
}
if (document.title == "Enter") {
    enterButton.addEventListener('click', function () {
        enter()
    })
    document.addEventListener('keydown', function (e) {
        if (e.key == "Enter") {
            enter()
        }
    })
}
let fields = new XMLHttpRequest();
fields.open('GET', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=8f11d0af0bbdc10a6b24559e5af930c0', true);
fields.send();
if (document.title == "Fields") {
    randomButton.addEventListener('click', function () {
        localStorage.setItem('randomeGame', 1)
    })
    document.addEventListener('click', function (e) {
        localStorage.setItem('fieldName', e.target.id)
    })
    fields.addEventListener('readystatechange', function () {
        if (fields.readyState == 4 && fields.status == 200) {
            let flag = true
            let fieldsArr = JSON.parse(fields.responseText)
            let templateCode = `
                <div onclick="window.location.href='index5.html';" style="cursor: pointer;" class="fieldListElement" id={{creator}}{{count}}>Название поля: {{fieldName}}</div>
            `
            let templateCode2 = `<button id="deleteField" class="CreateField">Удалить поле</button>`
            let template = Handlebars.compile(templateCode);
            let template2 = Handlebars.compile(templateCode2);
            let fieldul2 = document.querySelector('#buttons');
            let fieldul = document.querySelector('#fieldsUl');
            fieldul.innerHTML = '';
            if (localStorage.getItem('status') == 'admin') {
                fieldul2.innerHTML += template2()
                deleteField.addEventListener('click', function () {
                    flag = false
                    let templateCode3 = `
                        <div style="cursor: pointer;" class="fieldListElement" id={{creator}}{{count}}>Название поля: {{fieldName}}</div>
                    `
                    let templateCode4 = `<button id="cancelDeleteField" class="CreateField">Отмена</button>`
                    let template3 = Handlebars.compile(templateCode3);
                    let template4 = Handlebars.compile(templateCode4);
                    let fieldul4 = document.querySelector('#buttons');
                    let fieldul3 = document.querySelector('#fieldsUl');
                    fieldul.innerHTML = '';
                    fieldul2.innerHTML += template4()
                    for (let fiel of fieldsArr) {
                        fieldul3.innerHTML += template3(fiel)
                    }
                    fieldul3.addEventListener('click', function (e) {
                        for (let i = 0; i < fieldsArr.length; i++) {
                            if (e.target.id == fieldsArr[i].creator + fieldsArr[i].count) {
                                fieldsArr.splice(i, 1)
                                let fieldsSender = new XMLHttpRequest();
                                fieldsSender.open('PUT', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=8f11d0af0bbdc10a6b24559e5af930c0', true);
                                fieldsSender.setRequestHeader("Content-type", "application/json");
                                fieldsSender.send(JSON.stringify(fieldsArr));
                                fieldsSender.addEventListener('readystatechange', function () {
                                    if (fieldsSender.readyState == 4) {
                                        if (fieldsSender.status == 200) {
                                            alert('Поле успешно удалено!');
                                            fieldul.innerHTML = '';
                                            for (let fiel of fieldsArr) {
                                                fieldul3.innerHTML += template3(fiel)
                                            }
                                        } else {
                                            alert('Ошибка удаления. Попробуйте еще раз.');
                                        }
                                    }
                                })
                            }
                        }
                    })
                    cancelDeleteField.addEventListener('click', function () {
                        flag = true
                        let templateCode = `
                            <div onclick="window.location.href='index5.html';" style="cursor: pointer;" class="fieldListElement" id={{creator}}{{count}}>Название поля: {{fieldName}}</div>
                        `
                        let templateCode2 = `<button id="deleteField" class="CreateField">Удалить поле</button>`
                        let template = Handlebars.compile(templateCode);
                        let template2 = Handlebars.compile(templateCode2);
                        let fieldul2 = document.querySelector('#buttons');
                        let fieldul = document.querySelector('#fieldsUl');
                        fieldul.innerHTML = '';
                        fieldul2.innerHTML = '';
                        fieldul2.innerHTML += template2()
                        for (let field of fieldsArr) {
                            fieldul.innerHTML += template(field)
                        }
                    })
                })
            }
            if (flag == true) {
                for (let field of fieldsArr) {
                    fieldul.innerHTML += template(field)
                }
            }
        }
    })
    CreateField.addEventListener('click', function () {
        window.location.href = "index6.html"
    })

}
if (document.title == "Create") {
    create.addEventListener('click', function () {
        if (fieldCreateName.value == "") {
            alert("Заполните поле")
        } else if (fieldCreateName.value.length > 40) {
            alert('Слишком длинное имя.')
        } else {
            let fieldsArr = JSON.parse(fields.responseText)
            let field = {
                fieldName: '',
                creator: '',
                login: '',
                loginsecond: '',
                players: '0',
                count: ''
            }
            field.creator = localStorage.getItem('login')
            field.fieldName = fieldCreateName.value
            field.count = fieldsArr.length + 1
            fieldsArr.push(field)
            let fieldsSender = new XMLHttpRequest();
            fieldsSender.open('PUT', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=8f11d0af0bbdc10a6b24559e5af930c0', true);
            fieldsSender.setRequestHeader("Content-type", "application/json");
            fieldsSender.send(JSON.stringify(fieldsArr));
            fieldsSender.addEventListener('readystatechange', function () {
                if (fieldsSender.readyState == 4) {
                    if (fieldsSender.status == 200) {
                        alert('Поле успешно зарегестрировано!');
                        window.location.href = "index3.html"
                    } else {
                        alert('Ошибка отправки. Попробуйте еще раз.');
                    }
                }
            })
        }

    })
    exitCreate.addEventListener('click', function () {
        window.location.href = "index3.html"
    })
}

if (document.title == "Gamefield") {
    startGameButton.addEventListener('click', function () {
        localStorage.setItem('correct', 0)
        localStorage.setItem('gameStarted', 0)
        localStorage.setItem('startClicked', 0)
        localStorage.setItem('enterGame', 1)
        window.location.href = "index7.html"

    })
    let templateCode = `
        <button class="exitGameButton" id="exitGameButton">Выйти</button>
    `
    let template = Handlebars.compile(templateCode);
    let head = document.querySelector('#header');
    head.innerHTML = '';
    head.innerHTML = template()
    exitGameButton.addEventListener('click', function () {
        window.location.href = 'index3.html';
    })
}

let game = new XMLHttpRequest();
game.open('GET', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=91d96c5649b67e5a36d0c6bbd6fb62e2', true);
game.send();

function findGoing() {
    let t = setInterval(function () {
        let gamestep2 = new XMLHttpRequest();
        gamestep2.open('GET', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=91d96c5649b67e5a36d0c6bbd6fb62e2', true);
        gamestep2.send();
        gamestep2.addEventListener('readystatechange', function () {
            if (gamestep2.readyState == 4 && gamestep2.status == 200) {
                let gameArr4 = JSON.parse(gamestep2.responseText)
                let gameArr6 = JSON.parse(gamestep2.responseText)
                let myarr = JSON.parse(localStorage.getItem('myarr'))
                for (let i = 0; i < gameArr4.length; i++) {
                    if (gameArr4[i][10] == myarr[10]) {
                        if (gameArr4[i][11] == true) {
                            myarr = gameArr4[i]
                            localStorage.setItem('myarr', JSON.stringify(myarr))
                            for (let i = 0; i < 10; i++) {
                                for (let j = 0; j < 10; j++) {
                                    let k = i * 10 + j
                                    if (myarr[i][j] == 2) {
                                        let h = document.querySelector('#fieldPart' + k)
                                        h.classList = ('fieldElement4')
                                    }
                                    if (myarr[i][j] == 3) {
                                        let h = document.querySelector('#fieldPart' + k)
                                        h.classList = ('fieldElement3')
                                    }
                                }
                            }
                            if(localStorage.getItem('alertenemystep')==1){
                                alert('Ваш ход')
                                localStorage.setItem('alertenemystep',0)
                            }
                            gameGoing()
                            clearInterval(t)
                            break
                        }
                    }
                }
            }
        })
    }, 500)
}

function gameGoing() {
    document.addEventListener('click', function (e) {
        if (e.target.id.slice(0, 10) == "enemyField") {
            let myarr = JSON.parse(localStorage.getItem('myarr'))
            let enemyarr = JSON.parse(localStorage.getItem('enemyarr'))
            if (myarr[11] == true && e.target.classList == "fieldElement") {
                for (let i = 0; i < 10; i++) {
                    for (let j = 0; j < 10; j++) {
                        let k = i * 10 + j
                        if (e.target.id == 'enemyFieldPart' + k) {
                            if (enemyarr[i][j] == 1) {
                                e.target.classList.toggle('fieldElement2')
                                enemyarr[i][j] = 2
                                myarr[11] = true
                                enemyarr[11] = false
                                alert('Ваш ход')
                            }
                            if (enemyarr[i][j] == 0) {
                                e.target.classList.toggle('fieldElement3')
                                enemyarr[i][j] = 3
                                myarr[11] = false
                                enemyarr[11] = true
                                localStorage.setItem('alertenemystep',1)
                                alert('Ход соперника')
                            }
                        }
                    }
                }
                localStorage.setItem('myarr', JSON.stringify(myarr))
                localStorage.setItem('enemyarr', JSON.stringify(enemyarr))
                let gamestep = new XMLHttpRequest();
                gamestep.open('GET', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=91d96c5649b67e5a36d0c6bbd6fb62e2', true);
                gamestep.send();
                gamestep.addEventListener('readystatechange', function () {
                    if (gamestep.readyState == 4 && gamestep.status == 200) {
                        let gameArr = JSON.parse(gamestep.responseText)
                        for (let i = 0; i < gameArr.length; i++) {
                            if (gameArr[i][10] == myarr[10]) {
                                gameArr[i] = myarr
                            }
                            if (gameArr[i][10] == enemyarr[10]) {
                                gameArr[i] = enemyarr
                            }
                        }
                        let gamestepSender = new XMLHttpRequest();
                        gamestepSender.open('PUT', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=91d96c5649b67e5a36d0c6bbd6fb62e2', true);
                        gamestepSender.setRequestHeader("Content-type", "application/json");
                        gamestepSender.send(JSON.stringify(gameArr));
                        gamestepSender.addEventListener('readystatechange', function () {
                            if (gamestepSender.readyState == 4 && gamestepSender.status == 200) {
                                if (myarr[11] == false) {
                                    findGoing()
                                }
                                if (myarr[11] == true) {
                                    gameGoing()
                                }
                            }
                        })
                    }
                })
            }
        }
    })
}

if (document.title == "Game") {
    loseButton.addEventListener('click', function () {
        localStorage.setItem('enterGame', 0)
                                            localStorage.setItem('correct', 0)
                                            localStorage.setItem('gameStarted', 0)
                                            localStorage.setItem('startClicked', 0)
                                            window.location.href = 'index3.html
    })      
}
