function _getURLParams(search) {
    var queryParams = {}, queryArray, singleQuery;
    if ("string" === typeof search) {
        queryArray = search.substr(1).split("&");
        for (var i = 0; i < queryArray.length; i++) {
            if (queryArray[i].indexOf("=") > -0) {
                singleQuery = queryArray[i].split("=");
                if (singleQuery.length == 2) {
                    queryParams[decodeURIComponent(singleQuery[0])] = decodeURIComponent(singleQuery[1]);
                }
            }
        }
    }
    return queryParams;
}

function _getAllURLParams() {
    var queryParams = _getURLParams(window.location.search),
        hashParams = _getURLParams(window.location.hash);
    if (hashParams) {
        for (var key in hashParams) {
            if (hashParams.hasOwnProperty(key) && !queryParams.hasOwnProperty(key)) {
                queryParams[key] = hashParams[key];
            }
        }
    }
    var state = queryParams.state ? JSON.parse(decodeURIComponent(queryParams.state)) : {};
    if (state) {
        for (var param in state) {
            if (state.hasOwnProperty(param) && !queryParams.hasOwnProperty(param)) {
                queryParams[param] = state[param];
            }
        }
    }
    return queryParams;
}
var urlParams = _getAllURLParams();
var access_token = urlParams.access_token || "";

if (site) {
    $("#lp_account").attr("disabled", "disabled");
    $("#lp_account").val(site);
}

if (site && username) {
    $("#lp_username").attr("disabled", "disabled");
    $("#lp_username").val(username);

    $("#lp_btn_login").hide();

    if (access_token) {
        lpTag.sdes.push({"type": "ctmrinfo", "info": {customerId: "lpTest" + username}});

        window.LPJsMethodName = function (callback) {
            callback(access_token);
        };
    } else {
        ajaxLogin(site, username);
    }
}
else {
    $("#lp_form").submit(function (e) {
        e.preventDefault();
        var url = "https://exampleauth.cloud.lprnd.net:1980";
        var site = $("#lp_account").val();
        var username = $("#lp_username").val();
	ajaxLogin(site, username);
    });
}

function ajaxLogin(site, username) {
    var href;

    $.ajax({
        url: 'https://barakauth.auth0.com/oauth/token',
        contentType: 'application/json',
        type: 'POST',
        processData: false,
        data: JSON.stringify({
            client_id: 'BscG0X3K6R8dgFZf90ydTUOETQztDvrq',
            client_secret: 'u1qHTi_DQ7GVy-Z_9jI7wknEppVpvKYFZ7nTf_JrXlaRDVRorEz3xni5mG_4v7k0',
            audience: 'https://barakauth.auth0.com/api/v2/',
            grant_type: 'client_credentials'
        }),
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            console.error('Failed to generate JWT', textStatus, errorThrown);
        },
        success: function (data) {
            href = updateQueryStringParameter(window.location.href, "site", site);
            href = updateQueryStringParameter(href, "username", username);
            href = updateQueryStringParameter(href, "access_token", (data && data.access_token));
            window.location.href = href;
        }
    });
}

function updateQueryStringParameter(uri, key, value) {
    var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    var separator = uri.indexOf('?') !== -1 ? "&" : "?";
    if (uri.match(re)) {
	return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    else {
	return uri + separator + key + "=" + value;
    }
}


$('#lp_lnk_setup').click(function () {
    var isDescriptionDisplay = $('#lp_account_setup_description').css('display') === 'block';
    $('#lp_account_setup_description').css('display', isDescriptionDisplay ? 'none' : 'block');
});
