@rem
@rem Copyright 2015 the original author or authors.
@rem
@rem Licensed under the Apache License, Version 2.0 (the "License");
@rem you may not use this file except in compliance with the License.
@rem You may obtain a copy of the License at
@rem
@rem      https://www.apache.org/licenses/LICENSE-2.0
@rem
@rem Unless required by applicable law or agreed to in writing, software
@rem distributed under the License is distributed on an "AS IS" BASIS,
@rem WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@rem See the License for the specific language governing permissions and
@rem limitations under the License.
@rem

@if "%DEBUG%"=="" @echo off
@rem ##########################################################################
@rem
@rem  backend startup script for Windows
@rem
@rem ##########################################################################

@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal

set DIRNAME=%~dp0
if "%DIRNAME%"=="" set DIRNAME=.
@rem This is normally unused
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%..

@rem Resolve any "." and ".." in APP_HOME to make it shorter.
for %%i in ("%APP_HOME%") do set APP_HOME=%%~fi

@rem Add default JVM options here. You can also use JAVA_OPTS and BACKEND_OPTS to pass JVM options to this script.
set DEFAULT_JVM_OPTS=

@rem Find java.exe
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if %ERRORLEVEL% equ 0 goto execute

echo. 1>&2
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH. 1>&2
echo. 1>&2
echo Please set the JAVA_HOME variable in your environment to match the 1>&2
echo location of your Java installation. 1>&2

goto fail

:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%/bin/java.exe

if exist "%JAVA_EXE%" goto execute

echo. 1>&2
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME% 1>&2
echo. 1>&2
echo Please set the JAVA_HOME variable in your environment to match the 1>&2
echo location of your Java installation. 1>&2

goto fail

:execute
@rem Setup the command line

set CLASSPATH=%APP_HOME%\lib\backend-1.0.0-plain.jar;%APP_HOME%\lib\spring-boot-starter-web-3.2.4.jar;%APP_HOME%\lib\spring-boot-starter-security-3.2.4.jar;%APP_HOME%\lib\spring-boot-starter-data-jpa-3.2.4.jar;%APP_HOME%\lib\spring-boot-starter-data-redis-3.2.4.jar;%APP_HOME%\lib\spring-boot-starter-batch-3.2.4.jar;%APP_HOME%\lib\spring-boot-starter-mail-3.2.4.jar;%APP_HOME%\lib\jakarta.mail-2.0.1.jar;%APP_HOME%\lib\jakarta.activation-2.0.1.jar;%APP_HOME%\lib\spring-boot-starter-oauth2-client-3.2.4.jar;%APP_HOME%\lib\jjwt-impl-0.11.5.jar;%APP_HOME%\lib\jjwt-jackson-0.11.5.jar;%APP_HOME%\lib\jjwt-api-0.11.5.jar;%APP_HOME%\lib\querydsl-jpa-5.0.0-jakarta.jar;%APP_HOME%\lib\springdoc-openapi-starter-webmvc-ui-2.2.0.jar;%APP_HOME%\lib\s3-2.25.22.jar;%APP_HOME%\lib\elasticsearch-java-8.12.0.jar;%APP_HOME%\lib\shedlock-spring-5.7.0.jar;%APP_HOME%\lib\shedlock-provider-jdbc-template-5.7.0.jar;%APP_HOME%\lib\jsoup-1.17.1.jar;%APP_HOME%\lib\guava-32.1.3-jre.jar;%APP_HOME%\lib\apache-client-2.25.22.jar;%APP_HOME%\lib\elasticsearch-rest-client-8.10.4.jar;%APP_HOME%\lib\httpclient-4.5.13.jar;%APP_HOME%\lib\commons-codec-1.16.1.jar;%APP_HOME%\lib\bcprov-jdk18on-1.77.jar;%APP_HOME%\lib\spring-boot-starter-json-3.2.4.jar;%APP_HOME%\lib\spring-boot-starter-aop-3.2.4.jar;%APP_HOME%\lib\spring-boot-starter-jdbc-3.2.4.jar;%APP_HOME%\lib\spring-boot-starter-3.2.4.jar;%APP_HOME%\lib\spring-boot-starter-tomcat-3.2.4.jar;%APP_HOME%\lib\springdoc-openapi-starter-webmvc-api-2.2.0.jar;%APP_HOME%\lib\spring-webmvc-6.1.5.jar;%APP_HOME%\lib\spring-security-oauth2-client-6.2.3.jar;%APP_HOME%\lib\spring-security-web-6.2.3.jar;%APP_HOME%\lib\spring-security-oauth2-jose-6.2.3.jar;%APP_HOME%\lib\spring-security-oauth2-core-6.2.3.jar;%APP_HOME%\lib\spring-web-6.1.5.jar;%APP_HOME%\lib\spring-security-config-6.2.3.jar;%APP_HOME%\lib\spring-data-jpa-3.2.4.jar;%APP_HOME%\lib\spring-data-redis-3.2.4.jar;%APP_HOME%\lib\spring-batch-core-5.1.1.jar;%APP_HOME%\lib\spring-security-core-6.2.3.jar;%APP_HOME%\lib\spring-context-support-6.1.5.jar;%APP_HOME%\lib\springdoc-openapi-starter-common-2.2.0.jar;%APP_HOME%\lib\spring-boot-autoconfigure-3.2.4.jar;%APP_HOME%\lib\spring-boot-3.2.4.jar;%APP_HOME%\lib\spring-data-keyvalue-3.2.4.jar;%APP_HOME%\lib\spring-context-6.1.5.jar;%APP_HOME%\lib\spring-aop-6.1.5.jar;%APP_HOME%\lib\hibernate-core-6.4.4.Final.jar;%APP_HOME%\lib\spring-aspects-6.1.5.jar;%APP_HOME%\lib\lettuce-core-6.3.2.RELEASE.jar;%APP_HOME%\lib\jakarta.mail-2.0.3.jar;%APP_HOME%\lib\querydsl-core-5.0.0.jar;%APP_HOME%\lib\swagger-ui-5.2.0.jar;%APP_HOME%\lib\aws-xml-protocol-2.25.22.jar;%APP_HOME%\lib\aws-query-protocol-2.25.22.jar;%APP_HOME%\lib\protocol-core-2.25.22.jar;%APP_HOME%\lib\arns-2.25.22.jar;%APP_HOME%\lib\aws-core-2.25.22.jar;%APP_HOME%\lib\auth-2.25.22.jar;%APP_HOME%\lib\regions-2.25.22.jar;%APP_HOME%\lib\sdk-core-2.25.22.jar;%APP_HOME%\lib\profiles-2.25.22.jar;%APP_HOME%\lib\crt-core-2.25.22.jar;%APP_HOME%\lib\http-auth-2.25.22.jar;%APP_HOME%\lib\http-auth-aws-2.25.22.jar;%APP_HOME%\lib\http-auth-spi-2.25.22.jar;%APP_HOME%\lib\identity-spi-2.25.22.jar;%APP_HOME%\lib\checksums-2.25.22.jar;%APP_HOME%\lib\checksums-spi-2.25.22.jar;%APP_HOME%\lib\netty-nio-client-2.25.22.jar;%APP_HOME%\lib\http-client-spi-2.25.22.jar;%APP_HOME%\lib\metrics-spi-2.25.22.jar;%APP_HOME%\lib\json-utils-2.25.22.jar;%APP_HOME%\lib\utils-2.25.22.jar;%APP_HOME%\lib\endpoints-spi-2.25.22.jar;%APP_HOME%\lib\annotations-2.25.22.jar;%APP_HOME%\lib\jsr305-3.0.2.jar;%APP_HOME%\lib\parsson-1.0.0.jar;%APP_HOME%\lib\jakarta.json-api-2.1.3.jar;%APP_HOME%\lib\opentelemetry-api-1.31.0.jar;%APP_HOME%\lib\shedlock-core-5.7.0.jar;%APP_HOME%\lib\spring-orm-6.1.5.jar;%APP_HOME%\lib\spring-jdbc-6.1.5.jar;%APP_HOME%\lib\failureaccess-1.0.1.jar;%APP_HOME%\lib\listenablefuture-9999.0-empty-to-avoid-conflict-with-guava.jar;%APP_HOME%\lib\checker-qual-3.37.0.jar;%APP_HOME%\lib\error_prone_annotations-2.21.1.jar;%APP_HOME%\lib\swagger-core-jakarta-2.2.15.jar;%APP_HOME%\lib\jackson-datatype-jsr310-2.15.4.jar;%APP_HOME%\lib\jackson-module-parameter-names-2.15.4.jar;%APP_HOME%\lib\swagger-models-jakarta-2.2.15.jar;%APP_HOME%\lib\jackson-annotations-2.15.4.jar;%APP_HOME%\lib\jackson-dataformat-yaml-2.15.4.jar;%APP_HOME%\lib\jackson-core-2.15.4.jar;%APP_HOME%\lib\jackson-datatype-jdk8-2.15.4.jar;%APP_HOME%\lib\jackson-databind-2.15.4.jar;%APP_HOME%\lib\mysql-connector-j-8.3.0.jar;%APP_HOME%\lib\spring-boot-starter-logging-3.2.4.jar;%APP_HOME%\lib\jakarta.annotation-api-2.1.1.jar;%APP_HOME%\lib\spring-data-commons-3.2.4.jar;%APP_HOME%\lib\spring-tx-6.1.5.jar;%APP_HOME%\lib\spring-oxm-6.1.5.jar;%APP_HOME%\lib\spring-beans-6.1.5.jar;%APP_HOME%\lib\spring-expression-6.1.5.jar;%APP_HOME%\lib\spring-batch-infrastructure-5.1.1.jar;%APP_HOME%\lib\spring-core-6.1.5.jar;%APP_HOME%\lib\snakeyaml-2.2.jar;%APP_HOME%\lib\tomcat-embed-websocket-10.1.19.jar;%APP_HOME%\lib\tomcat-embed-core-10.1.19.jar;%APP_HOME%\lib\tomcat-embed-el-10.1.19.jar;%APP_HOME%\lib\micrometer-core-1.12.4.jar;%APP_HOME%\lib\micrometer-observation-1.12.4.jar;%APP_HOME%\lib\aspectjweaver-1.9.21.jar;%APP_HOME%\lib\HikariCP-5.0.1.jar;%APP_HOME%\lib\jakarta.persistence-api-3.1.0.jar;%APP_HOME%\lib\jakarta.transaction-api-2.0.1.jar;%APP_HOME%\lib\jboss-logging-3.5.3.Final.jar;%APP_HOME%\lib\hibernate-commons-annotations-6.0.6.Final.jar;%APP_HOME%\lib\jandex-3.1.2.jar;%APP_HOME%\lib\classmate-1.6.0.jar;%APP_HOME%\lib\byte-buddy-1.14.12.jar;%APP_HOME%\lib\jaxb-runtime-4.0.5.jar;%APP_HOME%\lib\jaxb-core-4.0.5.jar;%APP_HOME%\lib\jakarta.xml.bind-api-4.0.2.jar;%APP_HOME%\lib\jakarta.inject-api-2.0.1.jar;%APP_HOME%\lib\antlr4-runtime-4.13.0.jar;%APP_HOME%\lib\logback-classic-1.4.14.jar;%APP_HOME%\lib\log4j-to-slf4j-2.21.1.jar;%APP_HOME%\lib\jul-to-slf4j-2.0.12.jar;%APP_HOME%\lib\slf4j-api-2.0.12.jar;%APP_HOME%\lib\netty-codec-http2-4.1.107.Final.jar;%APP_HOME%\lib\netty-codec-http-4.1.107.Final.jar;%APP_HOME%\lib\netty-handler-4.1.107.Final.jar;%APP_HOME%\lib\netty-codec-4.1.107.Final.jar;%APP_HOME%\lib\netty-transport-classes-epoll-4.1.107.Final.jar;%APP_HOME%\lib\netty-transport-native-unix-common-4.1.107.Final.jar;%APP_HOME%\lib\netty-transport-4.1.107.Final.jar;%APP_HOME%\lib\netty-buffer-4.1.107.Final.jar;%APP_HOME%\lib\netty-resolver-4.1.107.Final.jar;%APP_HOME%\lib\netty-common-4.1.107.Final.jar;%APP_HOME%\lib\reactor-core-3.6.4.jar;%APP_HOME%\lib\angus-activation-2.0.2.jar;%APP_HOME%\lib\jakarta.activation-api-2.1.3.jar;%APP_HOME%\lib\spring-security-crypto-6.2.3.jar;%APP_HOME%\lib\oauth2-oidc-sdk-9.43.3.jar;%APP_HOME%\lib\nimbus-jose-jwt-9.24.4.jar;%APP_HOME%\lib\mysema-commons-lang-0.2.4.jar;%APP_HOME%\lib\reactive-streams-1.0.4.jar;%APP_HOME%\lib\eventstream-1.0.1.jar;%APP_HOME%\lib\third-party-jackson-core-2.25.22.jar;%APP_HOME%\lib\httpcore-4.4.16.jar;%APP_HOME%\lib\httpasyncclient-4.1.5.jar;%APP_HOME%\lib\httpcore-nio-4.4.16.jar;%APP_HOME%\lib\commons-logging-1.2.jar;%APP_HOME%\lib\opentelemetry-context-1.31.0.jar;%APP_HOME%\lib\spring-jcl-6.1.5.jar;%APP_HOME%\lib\micrometer-commons-1.12.4.jar;%APP_HOME%\lib\spring-retry-2.0.5.jar;%APP_HOME%\lib\HdrHistogram-2.1.12.jar;%APP_HOME%\lib\LatencyUtils-2.0.3.jar;%APP_HOME%\lib\jcip-annotations-1.0-1.jar;%APP_HOME%\lib\content-type-2.2.jar;%APP_HOME%\lib\json-smart-2.5.0.jar;%APP_HOME%\lib\lang-tag-1.7.jar;%APP_HOME%\lib\logback-core-1.4.14.jar;%APP_HOME%\lib\log4j-api-2.21.1.jar;%APP_HOME%\lib\txw2-4.0.5.jar;%APP_HOME%\lib\istack-commons-runtime-4.1.2.jar;%APP_HOME%\lib\accessors-smart-2.5.0.jar;%APP_HOME%\lib\commons-lang3-3.13.0.jar;%APP_HOME%\lib\swagger-annotations-jakarta-2.2.15.jar;%APP_HOME%\lib\jakarta.validation-api-3.0.2.jar;%APP_HOME%\lib\asm-9.3.jar


@rem Execute backend
"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %BACKEND_OPTS%  -classpath "%CLASSPATH%" com.jibangyoung.JibangyoungApplication %*

:end
@rem End local scope for the variables with windows NT shell
if %ERRORLEVEL% equ 0 goto mainEnd

:fail
rem Set variable BACKEND_EXIT_CONSOLE if you need the _script_ return code instead of
rem the _cmd.exe /c_ return code!
set EXIT_CODE=%ERRORLEVEL%
if %EXIT_CODE% equ 0 set EXIT_CODE=1
if not ""=="%BACKEND_EXIT_CONSOLE%" exit %EXIT_CODE%
exit /b %EXIT_CODE%

:mainEnd
if "%OS%"=="Windows_NT" endlocal

:omega
