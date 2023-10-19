FROM python:3.10.11

WORKDIR /app

COPY requirements.txt /app/requirements.txt

RUN pip install -r /app/requirements.txt

COPY . /app

EXPOSE 5000

# Uncomment below if if aws
# ENV AWS_REGION='ap-southeast-1' 
ENV AWS_ACCESS_KEY_ID='example'
ENV AWS_SECRET_ACCESS_KEY='example'



CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "5000"]