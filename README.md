# AxMedium

*   Run docker containers

```
sudo docker compose up -d
```

*   Create init superuser

```
sudo docker exec -it ax_backend_api sh -c "npm run seed"
```

```
Super admin username and password: super.admin@ax.com , root
```

*   Open Postman (most required) and create GQL request to route http://localhost:5000/graphql and you will see all queries and mutations

![Postman](git_static/image.png)

*   Please use Authorization with Bearer token

![Auth](git_static/image2.png)