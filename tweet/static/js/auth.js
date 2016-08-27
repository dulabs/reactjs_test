

var auth = {

    token: null,

    getToken: function(key,secret)
    {
        console.log(secret);

        var bearer_token = window.btoa(key+':'+secret);

        var params = {
                grant_type: 'client_credentials'
        };

        $.ajax({
            url: twitter.oauth.token,
            type: 'POST',
            dataType: 'json',
            data: params,
            beforeSend: function(xhr){
                xhr.setRequestHeader('Authorization',"Basic " + bearer_token);
                xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
            }

        }).done(function(data){

                var results = $.parseJSON(data);
                console.log(results);
                auth.token = results.access_token;

        });
    }

};
