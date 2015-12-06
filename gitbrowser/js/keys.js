define([''],
        function ()
        {
            var backend = '27b6e049-ddd9-4d81-9258-958113629a14';
            var auth = 'Basic TUNTREVNMDAwNF9NT0JJTEVQT1JUQUxTRVRSSUFMMDAwNERFVl9NT0JJTEVfQU5PTllNT1VTX0FQUElEOlJvNDBieXVfaG53dHZw';
            return {
                backend: backend,
                auth: auth,
                headers: {
                    'oracle-mobile-backend-id': backend,
                    'Authorization': auth
                },
            };
        });