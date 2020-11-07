@ECHO OFF
rmdir /s /q PetCareBuild
mkdir PetCareBuild
cd client
rmdir /s /q build
call yarn build
cd ../
mkdir "PetCareBuild/build"
xcopy "client/build" "PetCareBuild/build" /E
xcopy "server.js" "PetCareBuild"
xcopy "auth.js" "PetCareBuild"
xcopy "package.json" "PetCareBuild"