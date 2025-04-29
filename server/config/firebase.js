// const admin = require('firebase-admin');

// const serviceAccount = {
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
//   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
// };

// if (!serviceAccount.projectId || !serviceAccount.privateKey || !serviceAccount.clientEmail) {
//   throw new Error('Missing Firebase credentials in .env. Ensure FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, and FIREBASE_CLIENT_EMAIL are set.');
// }

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// module.exports = admin;
const admin = require('firebase-admin');

const serviceAccount = {
  projectId: "intellijob-b3c7a",
  privateKey: `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCu71mj37YGyNLo
uMGZdVpnfCejpN+OP+kEqUBZqWjf7sgAxiDc4F3eG3sFo+D00EVzTkV0QOrqg+Je
apd8HcCiJ/4q6UtDIn17EmmzAxz1AJo390zonc0JCnex1W40A2oYesA+oQOpcV+r
F9xwTrMT8CVJf5/kKl20/xZRS7BuTO/+v6W0JMpfo7ewVP9zdFFFE1LnE6+5UQ3A
o6I94uT9Be03lEzJRu//EeIa2M5rAJGyPYko7pc01heUgj3U4FS6jEn9dQ+Iz1eZ
acoydqqs4BAV83VFPiiP1jtHvxP2fGK3almyGi4y5yPO6bahZnH//Ep0+ZC9C9oM
74RBwF1vAgMBAAECggEAJomQ+FJwsbbtC5qj/7AEHfcSbnEEVLyMk1vL0tTIx0g9
pDoBhFcjJqpsJBZxmM0G97te/pjMh6RNKpqVy6BsTuy7h+2ECIKhHQs14NtHNkwP
LVQcC8SzphG5w6HumKPF7CWik0l6Woog1rq3c8BKoBJPzIzChwu0QArP+lHPyMRp
LL+HCghXKao+xp9GktEZAV+P53497DWWKexkdBWKmx1WsRrLMkNZxqZDnZuR4U81
Kr6A3B3opQBNpxwTLQXeDe/PJv2B/it4Z0qYsiEVC6h0TkXybQp/u5CNMAlNlGru
5IH2f9hx9IkfmKEcgQDKTXn38eJEewskvzAaYenLIQKBgQDxpR+IXIlao/hHRWZ/
vA0htyLOEalTK6XIQ6DEsOwuHiJbS8przcWEPwUH1xWC5OrmJ3j4ov54+IUQuhOm
CSOXHIPMPpTBMSVgPbPWiMQ9X68LSuFy9UqOvrQ+ls3iOpxhDb26Wdz/70CJ0MhT
1EgQGGWfuuZoYZ5f/qCzkmZPoQKBgQC5U7ec3eiQwhKKY1Lo0+UMPhNACv0pt772
8i49Noo85qyR7AvDni7shqS4FJfxA9OlmlMEtRckBs2vog8oCmrvQGUel6+/ksOW
TLf7eDrQuit++AP2Sl4QvdzCKFjQ0WIbS3yR1it4awyMCtTYWdKVUlGxPu8YDmiB
vJXopiDTDwKBgBK4PQIeURGxhClZSgB5O/cxrcOTALANwJEMFCdIoXNNKFI0Q+Eo
FrYQ/73EvsjeHQhpZGi2j8olToGmOKFzMcuiDN/EtVdmDEQxY34qKDGs+O2CBocW
U4lNYr86hYaSDc1C+EC4d3NoQHKstugvmMmOakj+fJz3ewJqwl5G6CAhAoGANPn3
bMIKbwbrIeAOnTulKAC+o/oAMGK0FgdYrGrgzVPrVLMzEbIwG7DJeU15uY2sfJRG
0vupJ8VCGsiqqHmB4+52eW5G8O5VNqurlBjkRzJQqLTg/RB5HzQG3QGHkfmon8DO
VSnxtzRym72k5kuW5NRpQc+JrUjBGwT7nUuP6oUCgYEAkftOJuj1IKBAWSsXJdfm
2elXrQLtJ+EkZh/6jq0P+CO2Rcw1EHDTCpBcKzy4nKn4KuGnRkDqwv6awf5Z7fBJ
4tnapCJoTG5CDtRv1oyLncoQANWhlQIIKSZ96GMyf1fIhxlvd9nmRvUFxKVvAjDx
dhTHYGnrQQWI8S5MHCh3sRU=
-----END PRIVATE KEY-----`,
  clientEmail: "firebase-adminsdk-xxxx@intellijob-b3c7a.iam.gserviceaccount.com",
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;