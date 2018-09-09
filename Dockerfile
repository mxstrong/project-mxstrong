FROM microsoft/dotnet:sdk AS build-env
WORKDIR /app

# Copy csproj and restore as distinct layers
COPY *.csproj ./
RUN dotnet restore

# Intall Node.js and npm
RUN apt-get update && \
  apt-get install curl && \
  curl -sL https://deb.nodesource.com/setup_10.x | bash && \
  apt-get install -y nodejs

# Copy everything else and build
COPY . ./
RUN dotnet publish -c release -o out

# Build runtime image
FROM microsoft/dotnet:aspnetcore-runtime
WORKDIR /app
COPY --from=build-env /app/out .
CMD export ASPNETCORE_URLS=http://*:$PORT && dotnet Goals.dll