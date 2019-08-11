<?php
echo "Sleeping 2 seconds\n";
sleep(2);
echo "Please go here and authorize, https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=727050962729-21prrhi89o2v48s6hk15rhct2l00of7u.apps.googleusercontent.com&redirect_uri=urn%3Aietf%3Awg%3Aoauth%3A2.0%3Aoob&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fphotoslibrary.readonly+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fphotoslibrary.sharing&state=NfGI7GQyQtxb87qGKdnxLRS4DJXoT8&access_type=offline&prompt=select_account"."\n";
//echo "Please go here and authorize, https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=727050962729-21prrhi89o2v48s6hk15rhct2l00of7u.apps.googleusercontent.com&redirect_uri=http://localhost:4000/send&scope=https://www.googleapis.com/auth/photoslibrary.readonly+https://www.googleapis.com/auth/photoslibrary.sharing&state=NfGI7GQyQtxb87qGKdnxLRS4DJXoT8&access_type=offline&prompt=select_account" . "\n";
if($f = fgets(STDIN)){
    echo "line: $f\n";
	if ("4/nQEw_MT1_u2aT_aDyc6CJEuhDh_WAM1F4UKWT22l25BufZpq-EIjZLpm92GqoIH2pfa4jCcBSI2FiwKaqqsxUFM\n" === $f) {
		echo "SUCCESS\n";
	} else {
		echo "Failed";
		exit(1);
	}
}
exit(0);
echo $line . "\n";
if(trim($line) != 'yes'){
    echo "ABORTING!\n";
    exit;
}
fclose($handle);
echo "\n"; 
echo "Thank you, continuing...\n";
sleep(4);
exit(0);
?>