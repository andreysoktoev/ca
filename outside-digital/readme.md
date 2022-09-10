Как развернуть локально:

    git clone git@github.com:andreysoktoev/ca.git
    cd ca/outside-digital
    sudo docker compose up -d

Дополнительный endpoint:
* POST /refresh-token

Обновить токен. Возвращает токен.