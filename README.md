# Student API: source to container

The API listens on port 3000. Student records are kept in memory, so they reset
when the container restarts.

## Run locally

```powershell
npm.cmd install
npm.cmd start
```

Check `http://localhost:3000/students`.

## Build and run with Docker

With Docker Desktop running, from the project directory:

```powershell
docker build -t student .
docker run -d --name student -p 3000:3000 student
curl.exe http://localhost:3000/students
docker logs student
docker rm -f student
```

## Push source to GitHub

Create an empty GitHub repository. In the project directory, initialize Git if
needed, stage the source files (not `node_modules`), commit, and push to `main`:

```powershell
git init
git add .
git commit -m "Add student API and Docker workflow"
git branch -M main
git remote add origin https://github.com/OWNER/REPOSITORY.git
git push -u origin main
```

Replace `OWNER/REPOSITORY` with your GitHub account and repository. If Git is
not installed, install Git for Windows first.

## Build and publish from GitHub Actions

The workflow in `.github/workflows/docker-publish.yml` builds the image for
pull requests and publishes it to GitHub Container Registry (GHCR) when code is
pushed to `main`. After pushing, check the repository's **Actions** tab for a
successful **Build and publish Docker image** run. The published image is
`ghcr.io/OWNER/REPOSITORY:latest`.

Before applying `deployment.yaml`, replace `ghcr.io/OWNER/REPOSITORY:latest`
with the lowercase GHCR image path for your account and repository. Make the
GHCR package public, or configure Kubernetes with credentials, so the cluster
can pull the image.

## Deploy to Kubernetes

Ensure a Kubernetes cluster is running and `kubectl` is configured:

```powershell
kubectl apply -f deployment.yaml
kubectl apply -f service.yaml
kubectl get pods
kubectl get all
kubectl logs deploy/student
kubectl port-forward svc/student 3000:3000
```

While port-forward is running, open another terminal and check
`curl.exe http://localhost:3000/students`. Stop port-forward with Ctrl+C.
