FROM nikolaik/python-nodejs:latest
#FROM villers/docker-php-python-node

RUN mkdir -p /root/.config /config /app
RUN ln -s /config /root/.config/gphotos-sync

RUN mkdir /target
VOLUME /target
VOLUME /config

WORKDIR /app
COPY js_app/package*.json ./
COPY js_app/index.js .
RUN npm install

#RUN pip install gphotos-sync
RUN pipenv install gphotos-sync

EXPOSE 4000
CMD [ "node", "index.js" ]