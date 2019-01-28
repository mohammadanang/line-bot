FROM node:alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY src /app
EXPOSE 3000
CMD ["npm", "run", "start"]