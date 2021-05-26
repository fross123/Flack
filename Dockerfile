FROM python:3.8.5
COPY .  /usr/src/app
WORKDIR /usr/src/app

RUN python -m pip install --upgrade pip
RUN python -m pip install -r requirements.txt

CMD ["python3", "application.py"]
