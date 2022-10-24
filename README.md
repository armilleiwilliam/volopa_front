# Getting Started

## Laravel back end installation:
(You find these same instructions on the back end app as well)
##### git clone git@github.com:armilleiwilliam/volopa_backend.git
##### composer install
##### php artisan migrate:refresh --seed
(this command creates tables and populate them with rate data and login details needed for the project,
the rates are totally invented)
#### php artisan serve (copy the link provided for the next part of the installation)

## React front end Installation
##### git clone git@github.com:armilleiwilliam/volopa_front.git
(the git repositories are public, you dont' need a ssh key, you are free to download the project alternatively)
##### `npm i` to set up the project
##### on the env. file set the back end endpoint url coping it from the backend installation link provided
##### `npm start` to start the development server
##### click on the link provided to access
##### Login. Pick any email generated in the user table and access with password: "password"



## Introduction
Thanks for the opportunity you gave me to develop this app, I really enjoyed doing it. If you have any queries don't hesitate to
contact me. I hope the following instructions are clear enough.

# Login
when running "php artisan migrate:refresh --seed" on Laravel application it generates a fake user, go to your database, pick
the fake email generated and access using the "password" as password.
It' been created by the User factory and Laravel seeders functionality.

## My understanding of the project
- according to what I have read I should have developed the rate checker and Login functionalities
  with an authentication token returned from the Laravel app.
- The token returned by Laravel never expired by default, I have changed the time limit to
  1 hour for testing purposes (check Laravel application in the file config/sanctum.php). The component "PrivateRoute"  
  regenerates a new token each time the page is loaded and set a new time out which after 55 min (before the expiring time)
  regenerates a new token in case no page has been reloaded to regenerate a new token.
- the Rate checker converts on amount provided from the currency selected to the final chosen currency and show the results
  in a Modal (see screenshots in root folder). I have noticed that in your template there were two amounts fields, I didn't
  understand why two as you usually put only the amount to exchange, you select the currency "from" and currency "to" and
  when you submit the code should calculate the exchanged amount. Or probably it was me not having understood what was requested.
  If that is the case I apologize about that, I have decided to do the test challenge the only time I had which is over the
  weekend when I could not contact you for obvious reasons asking for further explanations.
  I hope you can accept the code the way I have developed it any way.


## Axios
- the login code does not have interceptors as it does not need to send any authentication token but only receive it.
  You can find axios interceptors in RateChecker.js, which sends a rate conversion request to the backend.

