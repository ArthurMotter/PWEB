var arValores1 = new Array(9);
var arValores2 = new Array(9);
var sprintValores1 = "";
var sprintValores2 = "";
var sVal;
for (x=0; x<=8; x++) {
sVal = prompt("entre com número");
arValores1[x] = eval(sVal);
sprintValores1 += arValores1[x] + "\n";
r = x%2;
if (r==0) {
arValores2[x] = arValores1[x] * 5;
sprintValores2 += arValores2[x] + "\n";
}
else {
arValores2[x] = arValores1[x] + 5;
sprintValores2 += arValores2[x] + "\n";
}
}
alert(sprintValores1 + "\n" + sprintValores2);