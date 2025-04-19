def sendForm():
    keyBox = document.search.key
    val = keyBox.value
    if val.length<3:
        print("Недопустимая длина строки")
        e.preventDefault()
    else: 
        alert("Отправка разрешена")
    sendButton = document.search.send
    sendButton.addEventListener("click", sendForm)
