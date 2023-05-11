FROM clickhouse/clickhouse-server:latest

RUN apt update \
	&& apt install nodejs -y \
	&& apt install npm -y \
	&& npm install -g n \
	&& n latest \
	&& hash -r

RUN git clone --recurse-submodules https://github.com/ioncreature/nest-clickhouse.git \
	&& cd nest-clickhouse \
	&& cp .env.example .env \
	&& npm i

RUN echo "/entrypoint.sh &" > /start_everything.sh
RUN echo "cd nest-clickhouse \
	&& make clickhouse-migrate \
 	&& make start" >> /start_everything.sh
RUN chmod +x /start_everything.sh

CMD /start_everything.sh
