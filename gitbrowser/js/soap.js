define(['jquery'],
        function ($)
        {
            return {
                post: post
            };

            function post(url, template, args, fnsuccess) {
                console.log('invoking soap services');
                var msg = template;
                if (args && args.length > 0) {
                    msg = msg.replace(/{(\d)}/g, function(match, nr) {
                        return typeof args[nr] !== 'undefined' ? encodeXml(args[nr]) : match;
                    });;
                }
                $.ajax(url, {
                    type: 'POST',
                    data: msg,
                    contentType: 'text/xml',
                    success: fnsuccess
                });
            }

            function encodeXml(str) {
                return str && str.toString()
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/"/g, '&quot;')
                        .replace(/'/g, '&apos;')
            }


        });