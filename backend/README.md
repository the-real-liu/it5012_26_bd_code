# backend

## install the project

best done with uv:

~~~
uv sync
~~~

this automatically creates a venv just for this project, so no manual fuss required

## run migrations

~~~
uv run manage.py migrate
~~~

this creates necessary database structures

## create fake data

~~~
uv run manage.py fake_data
~~~

## change admin password

~~~
uv run manage.py changepassword 'admin@example.com'
~~~

## run server

~~~
uv run manage.py runserver 127.0.0.1:12383
~~~

you still need to run the frontend in another shell

~~~
cd ../frontend
yarn dev
~~~

