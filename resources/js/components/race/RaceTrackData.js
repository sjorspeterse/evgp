const leftLane = [[237.122045,124.6850213],
[280.445307,97.69561221],
[303.7998594,99.57548194],
[315.2450975,106.670053],
[336.7492787,108.0377518],
[348.355324,103.6645193],
[355.7850204,94.1218377],
[358.494658,83.82223594],
[362.757373,34.05535274],
[359.9565303,17.29265778],
[353.6600715,8.868980857],
[343.2238845,6.05243221],
[323.8672123,9.485390772],
[215.7067029,49.81826109],
[130.6004516,62.37411628],
[60.49788415,30.79533967],
[29.7968603,9.261002451],
[16.3285338,10.72330916],
[6.955296614,22.52119583],
[16.85312827,52.77980585],
[80.25367355,124.7363824],
[96.08182918,151.8930554],
[105.7002708,162.5348962],
[113.9195812,166.9890952],
[126.0800363,164.3796773],
[137.1983497,155.9700161],
[229.7356293,78.97163371],
[299.1858495,53.20696336],
[319.5747946,51.37297504],
[323.7019067,56.79675094],
[322.1089063,64.30364167],
[301.4413255,71.06161516],
[272.2485042,72.44022017],
[246.0677144,82.89939671],
[147.198799,158.07203],
[129.9718107,178.1183683],
[134.8888247,192.6340259],
[147.9544915,197.3336158],
[170.572456,183.3746037]]

const rightLane = [[230.8693768,116.8809108],
[277.9068326,88.02316953],
[306.9057912,90.07005256],
[319.8816209,97.80988082],
[336.1282879,98.00988596],
[342.6228902,95.47066772],
[346.0847113,91.18938571],
[348.6539205,82.04462904],
[352.7602968,34.29715194],
[350.5682752,20.73658945],
[347.566926,16.79826693],
[343.098893,16.05165104],
[327.1096468,18.94512748],
[218.7968251,59.32884176],
[129.3599802,72.29687953],
[53.78977491,38.21162381],
[27.80411427,19.06043934],
[20.32789709,19.88873841],
[16.67101931,24.88862745],
[25.05540834,47.05943859],
[88.50281142,119.0837967],
[104.4806437,146.4653566],
[113.2230058,155.5512597],
[116.217926,157.2567979],
[119.895201,156.4115473],
[130.9868615,148.1330897],
[224.3688508,70.53376143],
[296.7609572,43.5054224],
[323.2461509,42.02187405],
[333.3887327,54.31372829],
[330.9642606,68.94936008],
[301.4413255,81.06161516],
[273.9122564,82.30084532],
[251.2108271,91.4754326],
[153.6206127,165.7375573],
[139.8422166,179.7230763],
[142.1075775,185.7137942],
[147.8295077,187.3511293],
[163.3769368,176.4302173]]

const centerLane = [[234.2505183,120.4193779],
[279.1760698,92.85939087],
[305.3528253,94.82276725],
[317.5633592,102.2399669],
[336.3238019,103.1125786],
[345.4891071,99.56759351],
[350.9485616,92.64123794],
[353.5742893,82.93343249],
[357.7588349,34.17625234],
[354.7176412,18.25108836],
[350.6134988,12.83362389],
[342.7250828,11.05204162],
[325.4884295,14.21525913],
[217.251764,54.57355142],
[129.9802159,67.3354979],
[57.14382953,34.50348174],
[28.80048729,14.16072089],
[18.32821544,15.30602378],
[11.81315796,23.70491164],
[20.95426831,49.91962222],
[84.37824249,121.9100896],
[100.2812365,149.179206],
[109.3991717,159.177882],
[115.0687536,162.1229466],
[122.9235893,160.4867996],
[134.0926056,152.0515529],
[227.0522401,74.75269757],
[297.9734033,48.35619288],
[321.5352501,46.72004589],
[328.5453197,55.55523961],
[326.5365834,66.62650088],
[301.4413255,76.06161516],
[273.0803803,77.37053274],
[248.6392708,87.18741465],
[150.4097058,161.9047936],
[134.9070136,178.9207223],
[138.4982011,189.17391],
[147.7671289,192.3371276],
[166.9746964,179.9024105]]

const leftBorder = [[229.3062098,114.9298832],
[277.7937064,85.58323515],
[308.9043399,88.25396222],
[321.0118538,95.58966655],
[334.3385921,95.91368903],
[341.293714,93.50515416],
[344.5136555,89.02715415],
[346.4705232,80.93918095],
[350.2613825,33.92129588],
[348.2212114,21.59757236],
[345.907971,18.51610522],
[344.6459877,18.38597221],
[327.5779541,21.16766638],
[218.6155197,61.95046594],
[128.1316748,74.55355474],
[53.13730301,40.72769694],
[27.85360077,21.60031733],
[21.48006151,21.76131272],
[19.03951334,25.03287466],
[27.46756459,46.17934322],
[90.56509589,117.6706503],
[106.5803474,145.1084319],
[113.1404362,152.5449305],
[116.4938514,154.8116915],
[119.4923987,153.8176969],
[129.1216562,146.5835029],
[223.6066014,68.11744796],
[296.1547341,41.08003716],
[323.3853905,39.46796101],
[335.8104392,53.69297262],
[331.6316234,72.27530616],
[301.4413255,83.56161516],
[273.5004426,84.75829248],
[252.1322723,93.61635973],
[154.5745364,168.0062274],
[142.1829614,180.0117816],
[143.6960854,184.101094],
[147.8935228,184.8743426],
[162.0144515,174.5850442]]

const centerLeftBorder = [[232.4325439,118.8319385],
[279.0061526,90.43400563],
[307.1181682,92.92403615],
[319.0036097,100.1686354],
[335.0802059,100.8583841],
[344.381602,97.43770393],
[349.167654,90.85480219],
[351.3763373,81.90509376],
[355.2599206,33.80039628],
[352.915339,19.87560653],
[348.6574774,14.3399569],
[345.6923491,13.49668515],
[326.1123383,16.38729292],
[217.1244898,57.17795822],
[128.7824126,69.59608156],
[56.31710772,36.86909072],
[29.06651092,16.74966284],
[19.88820903,17.0214809],
[14.19799948,23.78397776],
[23.41588292,49.10916842],
[86.44052695,120.4969431],
[102.3809401,147.8222813],
[109.7984589,156.2639609],
[114.6713518,159.4677086],
[121.7798591,158.2637653],
[132.2657509,150.4712617],
[226.1946827,72.39551241],
[297.3671803,45.93080764],
[321.8611521,44.22996662],
[330.9670262,54.93448395],
[327.5797914,69.34568887],
[301.4413255,78.56161516],
[272.6386599,79.83311932],
[249.4399573,89.40311399],
[151.2159459,164.3021931],
[137.2597301,179.1389734],
[140.3033103,187.7738419],
[148.3910014,189.8495326],
[165.6122111,178.0572374]]

const centerRightBorder = [[235.558878,122.7339937],
[280.2185987,95.28477611],
[305.3319964,97.59411008],
[316.9953657,104.7476043],
[335.8218197,105.8030791],
[347.46949,101.3702537],
[353.8216526,92.68245023],
[356.2821515,82.87100657],
[360.2584587,33.67949668],
[357.6094665,18.1536407],
[351.4069837,10.16380859],
[346.7387104,8.607398094],
[324.6467226,11.60691947],
[215.63346,52.40545049],
[129.4331504,64.63860838],
[59.49691242,33.01048449],
[30.27942107,11.89900835],
[18.29635654,12.28164908],
[9.356485607,22.53508086],
[19.36420125,52.03899361],
[82.31595802,123.323236],
[98.18153282,150.5361307],
[106.4564815,159.9829914],
[112.8488523,164.1237257],
[124.0673195,162.7098338],
[135.4098455,154.3590205],
[228.7827639,76.67357686],
[298.5796264,50.78157812],
[320.3369138,48.99197223],
[326.1236132,56.17599528],
[323.5279594,66.41607159],
[301.4413255,73.56161516],
[271.7768772,74.90794617],
[246.7476422,85.18986825],
[147.8573555,160.5981588],
[132.3364989,178.2661653],
[136.9105353,191.4465899],
[148.8884799,194.8247225],
[169.2099708,181.5294306]]

const rightBorder = [[238.6852121,126.6360489],
[281.4310449,100.1355466],
[303.5458247,102.264184],
[314.9871217,109.3265731],
[336.5634335,110.7477741],
[350.557378,105.3028035],
[358.4756512,94.51009827],
[361.1879656,83.83691938],
[365.2569968,33.55859708],
[362.3035941,16.43167487],
[354.1564901,5.987660271],
[347.7850718,3.718111038],
[323.1811068,6.826546011],
[214.1424301,47.63294276],
[130.0838882,59.6811352],
[62.67671713,29.15187826],
[31.49233122,7.048353859],
[16.70450406,7.541817262],
[4.514971739,21.28618396],
[15.31251959,54.9688188],
[78.19138908,126.1495288],
[93.98212553,153.24998],
[103.1145042,163.7020218],
[111.0263527,168.7797428],
[126.3547799,167.1559023],
[138.5539402,158.2467794],
[231.3708452,80.95164132],
[299.7920726,55.6323486],
[318.8126754,53.75397785],
[321.2802001,57.4175066],
[319.4761274,63.48645431],
[301.4413255,68.56161516],
[270.9150945,69.98277301],
[244.0553272,80.97662251],
[144.498765,156.8941245],
[127.4132676,177.3933571],
[133.5177602,195.1193378],
[149.3859585,199.7999125],
[172.8077304,185.0016238]]

const controlToFullMap = {
    0: [0], 1: [1], 2: [2], 3: [3], 4: [4, 5, 6], 5: [7], 6: [8], 7: [9, 10, 11],
    8: [12], 9: [13], 10: [14], 11: [15], 12: [16, 17, 18], 13: [19], 14: [20],
    15: [21], 16: [22, 23, 24], 17: [25], 18: [26], 19: [27], 20: [28, 29, 30],
    21: [31], 22: [32], 23: [33], 24: [34], 25: [35, 36, 37], 26: [38]
}

const nControlPoints = 27

const maxX = 370
const maxY = 200

export {leftLane, rightLane, centerLane, leftBorder, centerLeftBorder, centerRightBorder, rightBorder, controlToFullMap, nControlPoints, maxX, maxY}