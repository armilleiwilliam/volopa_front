# Getting Started
## In the project directory, you can run:
##### `npm i` to set up the project
##### set your backend endpoint on env. file
##### start the back end app "php artisan serve"
##### `npm start` to start the development server

## My understanding of the project
- according to what I have read I should have developed the rate checker function and Login
with token returned from the Laravel app you find in the other Git url.
- The token is returned by Laravel never expired by default, I have changed the time limit to
1 hour for testing purposes (check Laravel application the fil config/sanctum.php). The component "PrivateRoute" checks every time a page is loaded
the token expiring time, if it's older than 55 min it's automatically regenerated.
You have asked to have the token regenerated every time a page is loaded, as above explained it already
regenerate a token when the expiration time is approaching, otherwise I should have added the function refreshToken
on another part but still in "PrivateRoute" component as it's loaded on each page refresh,
but it would have been a bit weird to have it twice in the same component, if a token is regenerated at each refresh
why checking the expiration time of the token, or maybe it's simply me not having understood what I should have done.
For that i apologize. 
- the Rate checker converts on amount provided from the currency selected to the final, selected, currency in a Modal.
I have noticed that in your templated there were two amounts fields, I didn't understand why two fields as usually
you put an amount then you select the currency from and currency to and the end the code should calculate the exchanged 
amount. Or probably it was me not having understood what you have requested. I apologize about, I have decided to the testing
challenge over the weekend I can not contact you, for obvious reasons; I hope you can accept the code the way I have developed
it any way.


## Axios
- the login code does not have interceptors as it does not need to send any token, but you kind find axios interceptors in
RateChecker.js when requesting a rate conversion

## To Login
when running "php artisan migrate:refresh --seed" on Laravel application it generates a fake user, go to your database, pick
the email and access using the "password" as password. 
It' been created by the User factory. 

