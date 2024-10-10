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
        let flag = false
        localStorage.removeItem('myarr')
        localStorage.removeItem('enemyarr')
        if (localStorage.getItem('gameStarted') == 1) {
            let game2 = new XMLHttpRequest();
            game2.open('GET', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=91d96c5649b67e5a36d0c6bbd6fb62e2', true);
            game2.send();
            game2.addEventListener('readystatechange', function () {
                if (game2.readyState == 4) {
                    if (game2.status == 200) {
                        let gameArr4 = JSON.parse(game2.responseText)
                        for (let i = 0; i < gameArr4.length; i++) {
                            if (gameArr4[i][10] == localStorage.getItem('login')) {
                                gameArr4.splice(i, 1)
                                let gameSender4 = new XMLHttpRequest();
                                gameSender4.open('PUT', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=91d96c5649b67e5a36d0c6bbd6fb62e2', true);
                                gameSender4.setRequestHeader("Content-type", "application/json");
                                gameSender4.send(JSON.stringify(gameArr4));
                                gameSender4.addEventListener('readystatechange', function () {
                                    if (gameSender4.readyState == 4) {
                                        if (gameSender4.status == 200) {
                                            flag = true
                                            localStorage.setItem('enterGame', 0)
                                            localStorage.setItem('correct', 0)
                                            localStorage.setItem('gameStarted', 0)
                                            localStorage.setItem('startClicked', 0)
                                            window.location.href = 'index3.html';
                                        }
                                    }
                                })
                            }
                        }
                    }
                }
            })
        }
    })
    document.addEventListener('click', function (e) {
        if (e.target.id.slice(0, 9) == "fieldPart") {
            if (localStorage.getItem('correct') == 0) {
                e.target.classList.toggle('fieldElement2')
            }
        }
    })


    readyButton.addEventListener('click', function () {
        let boatsArr = {}
        let chekedArr = []
        let nearFlag = true
        let nearby = true
        let onefieldboat = 0
        let twofieldboat = 0
        let treefieldboat = 0
        let fourfieldboat = 0
        let sum = 0
        let arr = document.getElementsByClassName('fieldElement1')
        for (let i = 0; i < 10; i++) {
            boatsArr[i] = {};
        }
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (arr[i * 10 + j].classList.value.length > 20) {
                    boatsArr[i][j] = 1;
                    sum += 1;
                } else {
                    boatsArr[i][j] = 0;
                }
            }
        }
        boatsArr[10] = localStorage.getItem('login')
        boatsArr[11] = false
        boatsArr[12] = localStorage.getItem('fieldName')
        boatsArr[13] = 0
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if ((boatsArr[i][j] == 1) && (chekedArr.includes(i * 10 + j) == false)) {
                    if (i < 9) {
                        if (boatsArr[i + 1][j] == 1 && chekedArr.includes((i + 1) * 10 + j) == false && i < 8) {
                            if (boatsArr[i + 2][j] == 1 && chekedArr.includes((i + 2) * 10 + j) == false && i < 7) {
                                if (boatsArr[i + 3][j] == 1 && chekedArr.includes((i + 3) * 10 + j) == false) {
                                    if (i < 6 && boatsArr[i + 4][j] == 1 && chekedArr.includes((i + 4) * 10 + j) == false) {
                                        nearFlag = false
                                    } else {
                                        fourfieldboat += 1
                                        chekedArr[chekedArr.length] = i * 10 + j
                                        chekedArr[chekedArr.length] = (i + 1) * 10 + j
                                        chekedArr[chekedArr.length] = (i + 2) * 10 + j
                                        chekedArr[chekedArr.length] = (i + 3) * 10 + j
                                    }
                                } else {
                                    treefieldboat += 1
                                    chekedArr[chekedArr.length] = i * 10 + j
                                    chekedArr[chekedArr.length] = (i + 1) * 10 + j
                                    chekedArr[chekedArr.length] = (i + 2) * 10 + j
                                }
                            } else if (boatsArr[i + 2][j] == 1 && chekedArr.includes((i + 1) * 10 + j) == false && i == 7) {
                                treefieldboat += 1
                                chekedArr[chekedArr.length] = i * 10 + j
                                chekedArr[chekedArr.length] = (i + 1) * 10 + j
                                chekedArr[chekedArr.length] = (i + 2) * 10 + j
                            } else {
                                twofieldboat += 1
                                chekedArr[chekedArr.length] = i * 10 + j
                                chekedArr[chekedArr.length] = (i + 1) * 10 + j
                            }
                        } else if (boatsArr[i + 1][j] == 1 && chekedArr.includes((i + 1) * 10 + j) == false && i == 8) {
                            twofieldboat += 1
                            chekedArr[chekedArr.length] = i * 10 + j
                            chekedArr[chekedArr.length] = (i + 1) * 10 + j
                        } else if (chekedArr.includes(i * 10 + j) == false && j == 9) {
                            onefieldboat += 1
                            chekedArr[chekedArr.length] = i * 10 + j
                        }
                    }
                    if (j < 9) {
                        if (boatsArr[i][j + 1] == 1 && chekedArr.includes(i * 10 + j + 1) == false && (j < 8)) {
                            if (boatsArr[i][j + 2] == 1 && chekedArr.includes(i * 10 + j + 2) == false && (j < 7)) {
                                if (boatsArr[i][j + 3] == 1 && chekedArr.includes(i * 10 + j + 3) == false) {
                                    if (j < 6 && boatsArr[i][j + 4] == 1 && chekedArr.includes(i * 10 + j + 4) == false) {
                                        nearFlag = false
                                    } else {
                                        fourfieldboat += 1
                                        chekedArr[chekedArr.length] = i * 10 + j
                                        chekedArr[chekedArr.length] = i * 10 + j + 1
                                        chekedArr[chekedArr.length] = i * 10 + j + 2
                                        chekedArr[chekedArr.length] = i * 10 + j + 3
                                    }
                                } else {
                                    treefieldboat += 1
                                    chekedArr[chekedArr.length] = i * 10 + j
                                    chekedArr[chekedArr.length] = i * 10 + j + 1
                                    chekedArr[chekedArr.length] = i * 10 + j + 2
                                }
                            } else if (boatsArr[i][j + 2] == 1 && chekedArr.includes(i * 10 + j + 1) == false && j == 7) {
                                treefieldboat += 1
                                chekedArr[chekedArr.length] = i * 10 + j
                                chekedArr[chekedArr.length] = i * 10 + j + 1
                                chekedArr[chekedArr.length] = i * 10 + j + 2
                            } else {
                                twofieldboat += 1
                                chekedArr[chekedArr.length] = i * 10 + j
                                chekedArr[chekedArr.length] = i * 10 + j + 1
                            }
                        } else if (boatsArr[i][j + 1] == 1 && chekedArr.includes(i * 10 + j + 1) == false && j == 8) {
                            twofieldboat += 1
                            chekedArr[chekedArr.length] = i * 10 + j
                            chekedArr[chekedArr.length] = i * 10 + j + 1
                        } else if (chekedArr.includes(i * 10 + j) == false) {
                            onefieldboat += 1
                            chekedArr[chekedArr.length] = i * 10 + j
                        }
                    }
                    if (i == 9 && j == 9 && chekedArr.includes(99) == false) {
                        onefieldboat += 1
                        chekedArr[chekedArr.length] = i * 10 + j
                    }

                }

            }
        }
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (chekedArr.includes(i * 10 + j)) {
                    if (chekedArr.includes((i + 1) * 10 + j) && j != 0 && j != 9) {
                        if (chekedArr.includes((i + 2) * 10 + j)) {
                            if (chekedArr.includes((i + 3) * 10 + j)) {
                                if (chekedArr.includes(i * 10 + j + 1) || chekedArr.includes(i * 10 + j - 1)) {
                                    nearby = false
                                }
                                if (chekedArr.includes((i + 1) * 10 + j + 1) || chekedArr.includes((i + 1) * 10 + j - 1)) {
                                    nearby = false
                                }
                                if (chekedArr.includes((i + 2) * 10 + j + 1) || chekedArr.includes((i + 2) * 10 + j - 1)) {
                                    nearby = false
                                }
                                if (chekedArr.includes((i + 3) * 10 + j + 1) || chekedArr.includes((i + 3) * 10 + j - 1)) {
                                    nearby = false
                                }
                            }
                            if (chekedArr.includes(i * 10 + j + 1) || chekedArr.includes(i * 10 + j - 1)) {
                                nearby = false
                            }
                            if (chekedArr.includes((i + 1) * 10 + j + 1) || chekedArr.includes((i + 1) * 10 + j - 1)) {
                                nearby = false
                            }
                            if (chekedArr.includes((i + 2) * 10 + j + 1) || chekedArr.includes((i + 2) * 10 + j - 1)) {
                                nearby = false
                            }
                        }
                        if (chekedArr.includes(i * 10 + j + 1) || chekedArr.includes(i * 10 + j - 1)) {
                            nearby = false
                        }
                        if (chekedArr.includes((i + 1) * 10 + j + 1) || chekedArr.includes((i + 1) * 10 + j - 1)) {
                            nearby = false
                        }
                    }
                    if (chekedArr.includes((i + 1) * 10) && j == 0) {
                        if (chekedArr.includes((i + 2) * 10)) {
                            if (chekedArr.includes((i + 3) * 10)) {
                                if (chekedArr.includes(i * 10 + 1)) {
                                    nearby = false
                                }
                                if (chekedArr.includes((i + 1) * 10 + 1)) {
                                    nearby = false
                                }
                                if (chekedArr.includes((i + 2) * 10 + 1)) {
                                    nearby = false
                                }
                                if (chekedArr.includes((i + 3) * 10 + 1)) {
                                    nearby = false
                                }
                            }
                            if (chekedArr.includes(i * 10 + 1)) {
                                nearby = false
                            }
                            if (chekedArr.includes((i + 1) * 10 + 1)) {
                                nearby = false
                            }
                            if (chekedArr.includes((i + 2) * 10 + 1)) {
                                nearby = false
                            }
                        }
                        if (chekedArr.includes(i * 10 + 1)) {
                            nearby = false
                        }
                        if (chekedArr.includes((i + 1) * 10 + 1)) {
                            nearby = false
                        }
                    }

                    if (chekedArr.includes((i + 1) * 10 + j) && j == 9) {
                        if (chekedArr.includes((i + 2) * 10 + j)) {
                            if (chekedArr.includes((i + 3) * 10 + j)) {
                                if (chekedArr.includes(i * 10 + j + 1) || chekedArr.includes(i * 10 + j - 1)) {
                                    nearby = false
                                }
                                if (chekedArr.includes((i + 1) * 10 + j - 1)) {
                                    nearby = false
                                }
                                if (chekedArr.includes((i + 2) * 10 + j - 1)) {
                                    nearby = false
                                }
                                if (chekedArr.includes((i + 3) * 10 + j - 1)) {
                                    nearby = false
                                }
                            }
                            if (chekedArr.includes(i * 10 + j - 1)) {
                                nearby = false
                            }
                            if (chekedArr.includes((i + 1) * 10 + j - 1)) {
                                nearby = false
                            }
                            if (chekedArr.includes((i + 2) * 10 + j - 1)) {
                                nearby = false
                            }
                        }
                        if (chekedArr.includes(i * 10 + j - 1)) {
                            nearby = false
                        }
                        if (chekedArr.includes((i + 1) * 10 + j - 1)) {
                            nearby = false
                        }
                    }
                    if (i != 0 && j != 9 && j != 0 && j != 9) {
                        if (chekedArr.includes((i + 1) * 10 + j + 1) || chekedArr.includes((i + 1) * 10 + j - 1)) {
                            nearby = false
                        }
                    }
                }
            }
        }
        if (onefieldboat == 4) {
            if (twofieldboat == 3) {
                if (treefieldboat == 2) {
                    if (fourfieldboat == 1) {
                        if (nearFlag == true) {
                            if (nearby == true) {
                                let gameArr = JSON.parse(game.responseText)
                                let fieldsArr = JSON.parse(fields.responseText)
                                let flagplayers = true
                                let flagsend = false
                                for (let field of fieldsArr) {
                                    if (field.creator + field.count == localStorage.getItem('fieldName')) {
                                        if (field.players == 0 && flagplayers == true) {
                                            readyButton.style.visibility = 'hidden'
                                            alert('Ожидайте соперника.')
                                            field.login = localStorage.getItem('login')
                                            field.players = 1
                                            flagplayers = false
                                            let a = setInterval(function () {
                                                let fieldcheck = new XMLHttpRequest();
                                                fieldcheck.open('GET', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=8f11d0af0bbdc10a6b24559e5af930c0', true);
                                                fieldcheck.send();
                                                fieldcheck.addEventListener('readystatechange', function () {
                                                    if (fieldcheck.readyState == 4 && fieldcheck.status == 200) {
                                                        let fieldsArr2 = JSON.parse(fieldcheck.responseText)
                                                        for (let field of fieldsArr2) {
                                                            if (field.creator + field.count == localStorage.getItem('fieldName')) {
                                                                if (field.players == 2) {
                                                                    let deleteCompleteField = JSON.parse(fieldcheck.responseText)
                                                                    for (let i = 0; i < deleteCompleteField.length; i++) {
                                                                        if (deleteCompleteField[i].creator + deleteCompleteField[i].count == localStorage.getItem('fieldName')) {
                                                                            localStorage.setItem('enemylogin', deleteCompleteField[i].loginsecond)
                                                                            localStorage.setItem('mylogin', localStorage.getItem('login'))
                                                                            deleteCompleteField.splice(i, 1)
                                                                            let fieldcheckSender = new XMLHttpRequest();
                                                                            fieldcheckSender.open('PUT', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=8f11d0af0bbdc10a6b24559e5af930c0', true);
                                                                            fieldcheckSender.setRequestHeader("Content-type", "application/json");
                                                                            fieldcheckSender.send(JSON.stringify(deleteCompleteField));
                                                                        }
                                                                    }
                                                                    let fieldcheck2 = new XMLHttpRequest();
                                                                    fieldcheck2.open('GET', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=91d96c5649b67e5a36d0c6bbd6fb62e2', true);
                                                                    fieldcheck2.send();
                                                                    fieldcheck2.addEventListener('readystatechange', function () {
                                                                        if (fieldcheck2.readyState == 4 && fieldcheck2.status == 200) {
                                                                            let gameArr2 = JSON.parse(fieldcheck2.responseText)
                                                                            boatsArr[11] = true
                                                                            gameArr2.push(boatsArr)
                                                                            let gameSender2 = new XMLHttpRequest();
                                                                            gameSender2.open('PUT', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=91d96c5649b67e5a36d0c6bbd6fb62e2', true);
                                                                            gameSender2.setRequestHeader("Content-type", "application/json");
                                                                            gameSender2.send(JSON.stringify(gameArr2));
                                                                            gameSender2.addEventListener('readystatechange', function () {
                                                                                if (gameSender2.readyState == 4 && gameSender2.status == 200) {
                                                                                    for (let eleme of gameArr2) {
                                                                                        if (eleme[10] == localStorage.getItem('mylogin')) {
                                                                                            let myarr = eleme
                                                                                            localStorage.setItem('myarr', JSON.stringify(myarr))
                                                                                        }
                                                                                        if (eleme[10] == localStorage.getItem('enemylogin')) {
                                                                                            let enemyarr = eleme
                                                                                            localStorage.setItem('enemyarr', JSON.stringify(enemyarr))
                                                                                        }
                                                                                    }
                                                                                    readyButton.style.visibility = 'hidden'
                                                                                    localStorage.setItem('correct', 1)
                                                                                    localStorage.setItem('gameStarted', 1)
                                                                                    localStorage.setItem('timer', 0)
                                                                                    localStorage.setItem('startClicked', 1)
                                                                                }
                                                                            })
                                                                        }
                                                                    })
                                                                    localStorage.setItem('steps', 0)
                                                                    localStorage.setItem('timer', 0)
                                                                    localStorage.setItem('alertenemystep',1)
                                                                    localStorage.setItem('gameStarted', 1)
                                                                    gameGoing()
                                                                    alert('противник найден')
                                                                    alert('Ваш ход')
                                                                    clearInterval(a)
                                                                    break
                                                                }
                                                            }
                                                        }
                                                    }
                                                })
                                            }, 2000)

                                        }
                                        if (field.players == 1 && flagplayers == true) {
                                            let fieldcheck2 = new XMLHttpRequest();
                                            fieldcheck2.open('GET', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=91d96c5649b67e5a36d0c6bbd6fb62e2', true);
                                            fieldcheck2.send();
                                            fieldcheck2.addEventListener('readystatechange', function () {
                                                if (fieldcheck2.readyState == 4 && fieldcheck2.status == 200) {
                                                    let gameArr3 = JSON.parse(fieldcheck2.responseText)
                                                    field.loginsecond = localStorage.getItem('login')
                                                    localStorage.setItem('enemyarr', 0)
                                                    localStorage.setItem('enemylogin', field.login)
                                                    localStorage.setItem('mylogin', localStorage.getItem('login'))
                                                    field.players = 2
                                                    flagplayers = false
                                                    flagsend = true
                                                    gameArr3.push(boatsArr)
                                                    let fieldsSender2 = new XMLHttpRequest();
                                                    fieldsSender2.open('PUT', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=8f11d0af0bbdc10a6b24559e5af930c0', true);
                                                    fieldsSender2.setRequestHeader("Content-type", "application/json");
                                                    fieldsSender2.send(JSON.stringify(fieldsArr));
                                                    let gameSender = new XMLHttpRequest();
                                                    gameSender.open('PUT', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=91d96c5649b67e5a36d0c6bbd6fb62e2', true);
                                                    gameSender.setRequestHeader("Content-type", "application/json");
                                                    gameSender.send(JSON.stringify(gameArr3));
                                                    gameSender.addEventListener('readystatechange', function () {
                                                        if (gameSender.readyState == 4 && gameSender.status == 200) {
                                                            let fieldcheck3 = new XMLHttpRequest();
                                                            fieldcheck3.open('GET', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=91d96c5649b67e5a36d0c6bbd6fb62e2', true);
                                                            fieldcheck3.send();
                                                            fieldcheck3.addEventListener('readystatechange', function () {
                                                                if (fieldcheck3.readyState == 4 && fieldcheck3.status == 200) {
                                                                    let x = setInterval(function () {
                                                                        let fieldcheck4 = new XMLHttpRequest();
                                                                        fieldcheck4.open('GET', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=91d96c5649b67e5a36d0c6bbd6fb62e2', true);
                                                                        fieldcheck4.send();
                                                                        fieldcheck4.addEventListener('readystatechange', function () {
                                                                            if (fieldcheck4.readyState == 4 && fieldcheck4.status == 200) {
                                                                                let gameArr5 = JSON.parse(fieldcheck4.responseText)
                                                                                for (let e of gameArr5) {
                                                                                    if (localStorage.getItem('enemylogin') == e[10]) {
                                                                                        localStorage.setItem('enemyarr', JSON.stringify(e))
                                                                                        clearInterval(x)
                                                                                    }
                                                                                }
                                                                            }
                                                                        })
                                                                    }, 500)
                                                                    for (let eleme of gameArr3) {
                                                                        if (eleme[10] == localStorage.getItem('mylogin')) {
                                                                            let myarr = eleme
                                                                            localStorage.setItem('myarr', JSON.stringify(myarr))
                                                                        }
                                                                    }
                                                                    readyButton.style.visibility = 'hidden'
                                                                    localStorage.setItem('correct', 1)
                                                                    localStorage.setItem('timer', 1)
                                                                    localStorage.setItem('startClicked', 1)
                                                                    localStorage.setItem('alertenemystep',1)
                                                                    localStorage.setItem('steps', 0)
                                                                    localStorage.setItem('gameStarted', 1)
                                                                    findGoing()
                                                                    alert('противник найден')
                                                                    alert('Ход соперника')
                                                                }
                                                            })

                                                        }
                                                    })
                                                }
                                            })
                                        }
                                        if (field.players == 2 && flagplayers == true) {
                                            flagplayers = false
                                            alert('поле уже заняли')
                                        }
                                        let fieldsSender = new XMLHttpRequest();
                                        fieldsSender.open('PUT', 'https://studyprograms.informatics.ru/api/jsonstorage/?id=8f11d0af0bbdc10a6b24559e5af930c0', true);
                                        fieldsSender.setRequestHeader("Content-type", "application/json");
                                        fieldsSender.send(JSON.stringify(fieldsArr));
                                        break
                                    }
                                }

                            } else {
                                alert('Некоторые корабли стоят слишком близко')
                            }
                        } else {
                            alert('Некоторые корабли больше пяти клеток')
                        }
                    } else {
                        alert('Неверное количество четырехпалубных кораблей')
                    }
                } else {
                    alert('Неверное количество трёхпалубных кораблей')
                }
            } else {
                alert('Неверное количество двухпалубных кораблей')
            }
        } else {
            alert('Неверное количество однопалубных кораблей')
        }

    })

}