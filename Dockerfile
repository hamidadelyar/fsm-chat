#Define the image we want to build from
FROM nginx:stable

# create directories
RUN mkdir -p /usr/src/app && mkdir -p /var/www/html

#Copy the current directory to a newly created working directory
COPY . /usr/src/app
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

#This app binds to port 3000 and 80, so we use the EXPOSE instruction to have it mapped by the docker daemon
EXPOSE 3000 80

# Lanch Nginx app
RUN cp -r /usr/src/app/* /var/www/html
RUN nginx