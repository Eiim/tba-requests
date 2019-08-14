# tba-requests
The source code and help document for TBA Requests.

TBA-Requests is a Google Sheets plug-in that is available on the [Chrome Web Store](https://chrome.google.com/webstore/detail/pifloagheimbimgjjomlboekcpimjmom). It allows you to access data from The Blue Alliance's API v3 using Google Sheets' custom functions. For more information, see Help.md or the [official Google Doc](https://docs.google.com/document/d/1gXv14J6kD4GPJuOErnbf-AW2xkxs6asXT-PaI-Gm1nM).

Most common error: urlfetch

As a whole, TBARequests can only make [657,000 calls/day](https://cloud.google.com/appengine/quotas), and I believe individual accounts are limited to [20,000](https://developers.google.com/apps-script/guides/services/quotas). If you are running a system which is calling a function, say, TBATeamEventQualRank (hint, hint) thousands of times per day, it's going to fail more often than not and cause potential problems for everyone else, too. If someone has more knowledge of GCP's billing system, feel free to correct me.
