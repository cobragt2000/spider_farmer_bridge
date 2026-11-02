import { LitElement, html, svg, css, nothing, type PropertyValues } from "lit";
import { property, state } from "lit/decorators.js";
import { live } from "lit/directives/live.js";

// Bundled overlay font — a renamed subset of DejaVu Sans (Basic Latin + Latin-1), so the
// live time-lapse overlay renders µ/°/² identically on every host regardless of installed
// fonts, matching the server-side burned frames. Registered at the document level because
// @font-face inside a shadow root is not reliably applied. (v0.21.113)
const SF_OVERLAY_WOFF2_B64 =
  "d09GMgABAAAAACrMAA8AAAAAfbwAACp0AAJeuAAAAAAAAAAAAAAAAAAAAAAAAAAAGigbpyAcgXQfhTIGVgBMEQwK7UTUdgE2AiQDhwwLg0wABCAFz2YHIBudbiXjmKXAxgHA9trxoqgLlFS+mQEzMinP/v9LApXDtSbleOEADIZCE4mu7FruK2o5Cr+xu+HURfHp3w3fNFc3w+dK9CFUQJGkZ03zGL4oSkWQVzgEQ/8Z+G3mPQPbxt5JXiYtPNZ+/55kk937C8QOFZACRIsSVNnVVdhOFaGrAgRXV9X/Nj/A3Po3NiIdJUjUqJSoFHCUwoAxUEoGo0alCJvQE0YN5IZwCB6MFpGjbNwpitJ6xlfuG42LuirJ8cBKdrxQVocd/gcGjgfoCOKoGXjM3DblY43QESR5RDVzulctDqjEA4DHayiD2zGCcsqv9tO9H7eXRJPOREUiKCovlEAiPWVKYHT9ctqbwh5BO0a/6lJ657L6ndpoJfs7gOAgHII2d9PYvGqIivbCF/T/37vj8Q8wkRL7Y0eJJVxgbW3TXvft2m+crulrVDPdTPgr8P8VUJhpwP9TtWwxxPFEnSNWjt3lUDSEqEvdFb271A/+jPCB+ZyFBG0klk/mOtLcHDQEuALDhZQ7x3Axlg6pTp3bVIVUu3fnppBVievOld1W/vu1VncviYeIWDtioPS36N5h/1ST2O7eeUmIRxqR0D4mmsSTVRohQkgFKoOJTM0nMzK2cAUxXjiCdv+fy1JmSG4nYjcHSonlUJewlE7RBFGL2tSix6+H7HoYaw6DrtJN8n/McW/8UoIECSJSyv0KIQB0AgBAAQUImAUBN7kJAhZ5AgKesgkHIADoALpYweE0xysQhBK2pyWBJCgAiN/ADThtK/G7iUnAA0ImKODQFk+MniAP7napeIcW+qiTYy3GaC6EiLn7I0I4AVERA0ELQSAa40nL2HtjTgYNN4raHMXTW2Jjx0ggcoP6AggHpICucvCgSHbfu30sMzQOas4dwneowBG9jhSic6cumS4z25D6fIT+AtWxiAwnN14VTzbVjtdjOqIiuomMDT5GKU8Wry4adYCFqrCc5hmQuoljGgByiAwvi4zlyYdeGyyhQT0WH7kBVecEDd4j6T7j05muL6pKPmPXUQ94RIPazK25QB8EU2KgZMXy7VymX9TW6px/dp/Na0AwkhJjqBJAyR/MJKoMRiX1pYvaIgZiLOackTc/V5AnYa3m0vUT8Am204qaVXGh1qaceWfW0YUEuIwTwZCvwwNXZGqbOlAZwAPUyBgwU3Wt4HXJMqD1XE1oVoRw3aL/oo/1T/VM92pW1K8R8t/tqMTykU/RmgFdJM0uh8+ipEhJpNzeSfGoKO7JZakrQgtjlKu4sKjSzYkKRIHmaaWCYbIlMChDYuU2XLYLwRpZD1JB+qmDU1/AVZIsGpCRuE9Vvpy5jpcBYECCi5dKvcMFR/Gpzl9IeJLVaD5DIAk0sNDMsYwCANaFrZbAmOym05TL4Eo6BccmMrd2AWOUmnUU3cSDXNAscj5V9tZkyTiFnjdPk2E06W72nPBYWTeqzgKljo29MQ+MyWrYUWxzje9/ln891gig4+TehXxW1KtKPrSLBYyLOgw1av73Xlj7FyD+xx6D+P9UUUKcECEgWyoQ1GjgpEUHD32W+LlwJcGLl2N8+ZESIICMIKFkxYuniIxMSYESGGXKqaOi0lSrkZYW7fT16WdqyChL06Y5mDXLEQcjSpQgYGBwUKYMSYUKFDVqOKlTx0WDBm5atPDQpo2XDh189OnjZ8CAgOOOE2TIkBAjRo4wZgzNhAlhpkyJMGNGlDlzYixYEGfJ0lEuXEhw5UoyUeYb+t0j6XRZUBgMR06IIy+0lwIDrGDrQkWUFcNRUeIoK3NUlSs1Zt4CxfibrYS1wRFHd9S1kwZXTILD0XR1eynDRknzZitwdwKCkOHb5wB4hRj4fehvC8TixQPEQ1w6IiEU4N9LkJAj0ISJECVG/aPbAGlJkHSMFCnSQETmpMiSA9KRp0CREgxlKovi4pxGzhEOjw9yoQlRAAbFjETT26hFnBZAAkwbCshXzQdZukS6BwYnvCjRA9DH3txJdFeI+f+l/pqK6kpPBNVbs3HLeOH4lu/ccr+/m5PvbG0Fo2JNZ5gaLLLK+7Y8l+jxqZL+L0cch8nex5UHNUeoGp+N7pQPnd4HlOrR0YdeeoFFVIJgot8cJwFiZChRtymFkeCKN89F04NncARrN+Dw7GnLFQQgnr57oANs8S9+WHUC7mcAaBFgOMDZAAAqY7xS4vDGrQY/kiIEaDq0wQ00SommDRHHZcRfU82A/xSA6QX2i5NDH25AggVRnGeYJ3JUjOSc1MgVEMANvMAHVthwitOEgwAkyGFHMqglxlaccW2k4J54/QnVIGDpkdDWCLiM3B55WGl15N7IE/uOO8VeYwT7Ocsb//6Ywz+MaL9hzcSG7vNTeuhXXrxM4fRoA2yzAw3MCVrpSaX1So8LcqPOURji2TxipmA3auqF2RwmFJJHFcv2OqDYl0agusgZOAHc0FsAkdO/wPQIgooAyp9TakzVAI4CzAYAYNkeZzzYoTCiRxarYkIribILIJFkHW31AgkIrKPArHbuyQEckMdv5J1tYlmuG0aHOez3dlxv8Ty/GsAP4+lnfv8O9QPCLwBkBaAF0Lke6N0f0EMA2SIq6eGDRQIncAACp5rjQSEd/RH6VUTgHNqzzfdChDN90aRAP6BRRDJUWlyYo98KtA9oMaHNAH6G/S2AQO/OLsZJ8k6GkPrIHDBdf5J75gjAsG++VeUtG/QnpGnJ6aRkWFzisOSg7DnwywjFKTb8J+tcNloL/XLF+MEknnSBZe3OttTEe7yFfXHBYWIxFmy05qIGiIBdTRYPf3mu6+g0Qe4POCxhdJrvOdTpH2f2/YgpqJrpQF0NZsRwwSZFHUCqbsC4ypEk9L5P3FsfIRsBBL6CiNRa5ohfo3r/jAbm4UmHFMw+tGivOOk2sITa2K4c+HxPdgcMJKw71BNNDQefmI7NLeozRGBE1Behxd2mXl0bVkgDYYcVcWSYqSBDKAwtQS4GJdCy02KN+o7UahiFjOPWxLb172fMBUn+6dsjwRnJ97eh/KjPZ98Ne3FJZURJeWY69o/+cwiOxDRAcr7C+v65mFLNw0q4cMVouV9D34nT6+a4fCW6qii4nAyuplcCVgPRDsL9mwjRNVKGDvUvOQhTBpLkOQqarFncitSG21b590ku9Jsybncu44C9hd2Bg138zqwV0OIpwRM/qm/hay9KKCH5pItKkuWrM+HFyPa6kNmcmwykKAhR9iBUr+ctFUlCH8NQIh0Xu07Xv0OM+ZFsv25mi7AHGUn4cLbysFYV5EtM+Kbwl1xja0mZXMhKsaXetSYe/mLgr4//Ai1QTLjDTEir6ztK5iFHEYEcMCU4tzKwqLhPRrpG+m1pfeFfNnpnknv+pl+wuuTpazRB1uqsWf3nVBo0rv5whDgu5a6acb+H7/6K269WFa3lvkxdzp56YYcW2tJcOVeXa111xY5DqbbmI5msVW2zQwk8f4o2H5rURqev2qKT0QZYCedo934oSWDQ6fKDda2v0tsXrF2DPTUycYH9yjUY3itv99De8+bBAChOW/9okmSUOz5N7fBCKW+rghJXQ06qNhJi6tBcHn5R35Jcm3S2sz6OKHmlyyL/21BUlXb9VaDxFJSw/I5BJN5zPRo7a2yJ1bD/Uz0dQOhJQuGmwYLWKOWBKm8IZ+JEf4ryyxMLzxY89TSfkuR3lQXmT+YAsj3YR9kVC+QZjHjKxRtkIZT7NB7SQ//zFiMaO+5mTDWhY3RbSyI8SCR199ZgyZqqlDnnnGLpaOBjC9CMYBfwqCRi/sIJ1wJ2f7vhEhzrlNShF4J7IgILpkktQs6NIf6WuqaqQ+bSnSE5iZ4ivVe19DPcDiNPoqVziOedm3f53n16YD0CMUfYeIFAlEzS3o1YYaQvdcQwD6rKX+c/f6yG7tsFSNHjZfrX7JWsp3Di8sCFkyIfTWXB6D5m0OOBDUIO+g3Wgvio2xrWcKA2rhRPZ46x82LOo8n1spJmPHU6iHUQhRMJPdM5URa4EhtrMuyhcBvFk8R/ruE1quxiN2ESZ1njVbP3Oc62xq1YgNzWQOjdrT53b7ZgClQwbRm8NS1RFNRAEQQ1qj77LqOUnDEHbkObKlmfxtGHVRYMJE4+K3ywCAltwRhx/OX//IZhvgOMosCgxWSguY9ta8FEYCfBBXv6zAzqS8Uv3zPLmFuzrlO+Ns6MlxvE/sVRWOMyoKsQVQV0tom2SlOxYC49ZDJFX0+tnjbJDAB100NF+MFrN/tvbt/LDxAYjmCM/dM2IpqCfcJBRNwglr9bbZBqaGwlzyGNCdsxKWoJNbMxco3u/1QhtYtauOaCrC6bsvC8rbdtU3/donQQSx/s47q9gB7BQ+qKla9pLqenjzXK8AYmlUfSyT8gplaqBQ0sd3pyauFN6/zEeCTciDBlzRCqxGgrdWk7ascRDHEyHpxmFgy3vb8yy/k9fX9efPsLfTOCPWJ96vIv2grVOaDmBAJV8LgpzmxLABICmfrePQmdLyjDUTQeJpNxOppI9nVVL73oCts3NRcyWSKN6h9DHJ7S1CfVD9TI2NmiRFgxpFkKAUo2CaT5+51KMHZSdftb1yZJ1NVeswhTuVRzFhjJr7ug+uQbVqXaci8tG0RPvF1W7XIySDgexJdNFCpWD6xk1fTdnOj3cKcqclUBOmQJWWWxtSpS70S0gAPePqpLSUQ6IS+w7K7HYy+P5S7QZ7bdlZdGPxUXi3aRsza0F23kTRIQGrwkkM8In47fff4/+LlZm3xbeCpkXfox+rWF9/Pfocjn/EP6QxPEvJlVOQNPJbRDP8U/tWYkDgz603kLodwXg863aGoh2tVPzSdswRQOwMOPj1RKU2Pj4asnkQ99EjRYr52J+KWLMvBijIIZ3N/Cn09OBu3WReDli6M1Gj9vbxmO/x6VNLbw58J+CZHl1j5B8EUAljG+VZgitjbu3f7eAIKJfJbiPImB7xwwZ/1OHpkcDZOO8iuDj8nKRNN5FG0CQnc4+/TzdS4mBGQ437I5ea73ZpsH1Fbc6qlLvdzUrNEMWqF7HLi42T2iNHBpLNTo1+rhKnCyVymi+C4xPBz9xNZiaimb9YF9aikmwFsF5VgeS1eOo3cQ6Ga0iBPeNi0xsW0z1KZyoDtHs2ULrn71HWhnYugwoo0H7TjEfe0z2tdibO/ZJcHSBmapv7F7fXJV8A3+31PIATl/qT/9NQZ1wpD9O0rskdY/dm6whaJ/01gg60ww9lzE1sOreeiCxNDg7Fg4LXIxKKqupCiqPugk84uKxwvMo48/nZyceNLWMf5kcko8JrWR2Ly3JLIuCG3cwugGQ3R+hwVBsAPxWZA+WWdOT6y3t7OeALbcO5DHYEL9AjuCa9fmOiJ6bNxsS2p+cFsE269wpkzwF8ciTuUelflZUxsbvIst/s9A5FFB6VZp1KFBjlXXs5usAAYmEDOK1W3TdzpTlBRsaEFQ0vpAbVSkdL9w7uXLopslex0Nr+sXtjbr5hvfAJ+LyNz3pn5+cyuGHN2xAIvUC+POgZXRJmGOcMM80ncli5g1wAgziAzmUSMmWOyjdHSYj9q+4zzg/a+1K922hSdsIbpImiENT8J5Ha6BQimbqVBWxwT1v/xaW48bGTK/tY1vaFS8tf0Hz4XsLNUP4Wdl/8Tw6w+PVIIrC++6ApxaHsxTUPHHHPMak5h+gaqBS/BqdM/obSiLeGCf4XArS3/NIPhf0Zc3TjkxQpMv8IuB4QcVqlzXPPWZ3n+S4X8rn1GeD9BfNEic+buBUsKq7xnsHW1oSz+X2pXdHDCNSVG5RpRfkg95wX9vOKeaCfoxKvK7sofIgNuHt9l9bNwyrmseBNnsY0xc0kyQkPZ3jPDr/7T4hMNvyMfKr4boz+rFDyz/1dqKeQyc6MAEqICmo2UFfbyrkz5RAfNEZ5c/T55MlieGpuK19EBQCG2BvXoqfhuFfvPiiPgOUvhCVpQvQ9qLJgt8pezrWMX9/DX5fa3bcP4mldFSXk5+KrWHVkYThp4slKdeLRg5vPt889fdkQLCyV9U7FqgrPO8/PKFxlundC+44tKohcVFtYVpaQYVFWOZsCXH8sRcUvFceiAgJGx+8mpYwhZKiG8O+kJ2pE9vl2StG6XVwntjqTBshSOoaYOaNhmnRw7sCpMfrMRRP8X7vbYUCNZ1+SlAH3lAMqm44eAXZ9QuMhHKvPWvf5M6S4sxLQw5GRJccvy0QUhRYoLvsDPOYeq02XXTWNbzuXYv14qQk0En3+EzA8OM4Jskpborh3yhu+YChZGdVdOtMGbpRXOLvfLP16WlR9/6Yy95WHgWU7YuijOeX423mbT1jS3SPD9E3raLsG2NGfKYayeKJ5yJixVNaCv8io31C0nKwakSmsddi/Jz8nNK3aZHy91zcwryTpRNPzw7kN3uEemzT+a21pPgBK0FIeEXKpIBg/uYBvaD8rzO8jw21C5hnLpby6outJZ0O8bc0KqnJhFTqMn1H3tQL7/NXq3M7ySL1sszVpqXjqz/kAR/UhQ7JvzF6SI4YqaudsQMil6cjglfO+P61rUkoJQeG1dKDyh76wLHjPUqPxrLSehqyx01nu5pH26IKyhqOjPUDgIN7CHmi4lF5qLsV+aNx3WFMqksP6bf8gp46bMvevSKFKb5HwvsCD/fnJjE44fXcrkmOT9KDv8RUSUiYqCna7wi8ZeVsZgr+Of4FeAU+eLzRSoqf6i+DJkodOvDrjfTtiyx4cbr6Blt6ai9MYNuWb5bd+5m8Go9YnbesDoSa18lPnzVAU72AufIS4rBKnVQ3/zjQ2vgt7fRwDlIO07y2uBwlZbiYhsb4ColXfxpt0UGIyoyy8IyszsqKpNReqbBYXXLxfIyfFT1Ys/SD9h5+gy2fxwGr5DikJ8MeJU+brxDKKJbASNSbUlt8ah7KWD2YMpOPJtinXuraX0mz73hfGTmRkYpr/sS/GA/ri4aT/cROaytLysuri+pBadSxgLRZNU4omc4Pz06Hd8jlyW5rfnP49F1pc1jZ9/p5evey3Z640wcmCzPSyojt8hlS2xrL8/2/31099OZdRWAGPZ7pghwaq0yVgT4VdirVQcDD+ZvGOWDqlWGsoKGlPT2lMED08Nek61/Jct49QDTwAaUM/uWKOOdaP273eml35YgsQ9F/0KL7qMPgUecvU7UTNNc37ylgORZ787uzX6iGCAL4Mxeb4uhxawrIoUWVxeB25jdQLNEXVxkzncW0QL8XGJ9lAPgQh1Q+oCvh51kqTTEBNXPYsCtlCff495TwHKBLae9PHb+RC/LVQN7+0CKOgWOfiYcI7U4k2D6+GZ/DDmqgJjcwnp8TWPMM5/FtImZxFVcWbneNf1z9geHSH7v+SbcXzoBOky86rRq6If3P8DGX2+190Vtra1fBWzKCfPoIRz51qEjDw/QLbKHcH5948AlNg42acZXvDVbNf1GFnZu3yY04kdAC2V6YRiY0780rIVEtM25TnYqgQVmNJyl1rL6TiPOWeWv5ujMXkcIXn6xuno50lUD1/+Hh/rwT9/6e+zs34aRhoNRGne14gXMTPlE1R1+7nApjc0jGhkjFTTWgGAb6JWJtQxFe/nGRetR9O6P3x+iDPlMDjCnwULJeonxtKGe+UuL/PqGdY+9lvt1lCuyX8ZPdsRPq03D/6+Rqdkws6irkTl3fpgjUQbdyfEQLoHJAhcHBoNFbye35TT0TzOy0pwqyh4/HE2aW3gHAmI4Fi4R3SvWK2zaP12zf7m0GpzxxLXkeOqIv1c9dZPyzpsT/GcDDsyUMOMgcFTscoHgUFfpRJ4lFf05/XGHMU7vTLlEovR8ATyVulJoGdU9M93viRsftCH8GZmVzSR/I+X2muFrVTPcrO9/sbzMfNFQ1/9yabH/39pLB8KmYqLCZgf/oc1ExdCmQLzsPw5cfOPMDLZk+vpD7gl0dT+IFokncgXhYpgs4OJjgVH3tW03tHZr78qMD53fwTxmPKpU9OE1MLtmO+itdlkttLIiINAu0q1O4X/zGozmytbPfz0OvaEUrzQTY7RgFFlUFXzCE+/LVD5kYprqi+ib/XcII7IgQaLbkClkXKWHd+o0bZrdSX+AK6eU28DAeC+rvZ1Mz2m4Ms0gs3CsKw4xQ1GkucX3Mh/6APkQNy++e+WRNi/lhPsOnPjFeKHos0IBZ9efx2GJBOLWj4g2HsE0roPLmVmv8IfNuvPYXWl92L1afF29ZuFQG+u9WJeVU0dL8ApwPV6qECAT6DMvvpvQDj4P3GK4s31ajirX6orlPC6B/bkZqs23vrpn75viU2usKbSZs8SGg2d9td9sKE7VJ4Oqv7aFVidKJkmFVLd+HWeA1AtZ4AEmY+H39JsLgScpX1tDqhdRkmS/ybavNYHYCy4U22+9tc8OGuKJNTYUm5r41Kb3z3rrvv2cXqTBcJzPsGNk0kWLbvuoPZp1eHC/V6T/G4RTiVrLOnviw2RsnycoIKPaaUKMEE3vKQquFe7eZo3zU1REdl5xVy/XcOQAUZwzqkLDVZVpJ1uh5MUlQ1A4EOU5juDgMTgQlyeAnBuyQgGc9q+NeqqXq1vXp9IePiqnlN/XYW4z395fpCy+42T//1/rRjkwHdm+cy+FePu2BybdxlaFmHnvTsq5O3cup6pYW2Qo35yw54h3bnsrkyzsVFKDDCISk3EJqcp2VmmYsOJztBbiubaW6sG3XkpJudQKbvcX2xaXFzvIHYYBNC8yj5X7TPZk5uSstTsP2TOAZtgOA02fmZ/5GOCeDUiM9P3POkTX63zJt7K31qG6njXlq7UMf9UaVbPIeF/X0NtE+qMH6UUtMaFhVaeM1swS7GpWLw+4t8gEyTCwqnWqFoRzAV6EjexqdkZ+MyHsVE2ofr9FsnPRIr3XvVkGVF6gV1dWy5abDLDjvN3MlZhw48Rz0prjUS8QNjRP81HNtHjOQBOhePu05ETsFRVG7Mhi2+HFJTvh9Ckwt4tLT++EnbKQfWm9HwvtFQrlHRp6B9vamQOX7LLk7BXzHWQqpF0ef/9w7/73/x67l0vDed8h8tDA2PWGczMUx9MFTWUp5TOVU6OosLRQkk25oqNivps0Vdp5bPhP0feduQ6+dpFe/nGFFKIsOARiZrX5tflnH3b6K3V+GgkE68L9FMC2ryG0ne8QO066HVFMYODm5rSRxchJWGtPryCbGMLQQHoWNi45Ap3h4KXjVvH8SsE9iwi34yYO+EtOIHjyM7YeCwqcyX6JSX6+iQl+fokJvr5JyT4FdiT9gQ2dFIcS1mhZ+chIednY+N6ELNYV9z05lB6GNqn/H0DPC/URsUlyL4P0wx1i/U4aZSm5KpG9pEukzS8OFCdUeUjng8JNXJgwPsE/Z7r0qnmOmLNolkX6McfEDB8XjyTPBGxCeDjOxsoi2ipCPUbY72iqGzpf2JTaR4p2DokA9VHConNGCwz8AVx8LNbFyrry+vrLfdWscCt1Fd7vk/VlbuIY5xPeQr4GPlSfKEKNt4a3Bqg1sK8DF60auORngEu+xucf9OsN1gzyJQiOuKwdrkFgonGcfkhGaLoulr+/GO0upGc5qyunib0FvPN8t6Kfq6ftq1aybydpFMFxipdIj9zemJ29/WRk5O7Tmdm7G8PEM7kdFaV57XFnctpLK8ntICCGedjp//DjbnJ1xgwPH+7MtMaYFIZgQ4LqN+25iT4jzhHkLLmpcKsIXs9hYCY+zGRecOVwBYxdQm2Dg23tsFh726AgW+wqqEngyAtFqWKfJWuieyq9PZXY0UF0sSGxFJ1J2+tw6kk2c3+zu8j5fHR73m01cfb5NrFu9CoaBI3ZHVc3xkTj6B1Ty9TllZ1dP6rf0Q8b54Eg5KbX0srSUnrmys1PylxcWnTlZjDwxAdrr/lsdjhENJCcc6pjmWN3X8k5XKUHmVR1LG3zjvHh7thITlq04YX16JyJCf5jwZvgy0tvUj0FGx6hqY4Q1AZzeQ5/wNbGRnPK8V8RYKjpbVxvcllZM7UG+BkpS++ePLn35CXHZiP3ZSJOz9zPTqOk50xENf7K1uiaXbmkmwTDV7ZKxj4tIzzM1iIAbx1mEmGBLQvL7+1vlOEmFCWnFJWfL06chPioemhkjFS2NCzfuaOee8ja6ZIdbqXvoT78M6uLY3GLRtFGg9Ead7XOXv6S6ZXulvEogzJ9f6Jvi9a35mHEu5dtHQ1rx6lDBx3RuMx6ND818Kz2Ip/DVLbxJI9Kbk2K/MDvyeTFSymT398rk2ciRvX0EZuzClGSYddW9/KoXkkKONVI0PmY/PmW9O7zp8+cdj9K2WZ1ii98Kwlq9tuKffMVTQtraSao2zT1vV5zE0m0zmk09jK+mSGGNv3vNP24g+H5y+E+F4eNUu1CZuPhxnUY7hz0Ed63ZeSeGQ+v3FThOW+SQZpAqP+YUTXy8T5oFWiUfrQNCrKzx2IfkL2d12bZllsl8uifHOQXQssCOARVMW6IE7mIspjaMNUfdpPdghL7oMPCRbADZNkEoy5jcelemfLE8gnqBD0LHv/zXZ8TETn/uql9e1yvh6MDKRCSlScsCvzclfPAWz0PEqaVr8Py+mrfrNA67jpR/teucvw1XEC+FlX4QjKRgh36tHG99u2m12DcVZwBYwDUH1XOvzZsVz7B63THKlhpzesL+xr9Am9Kx/yzE2OBZ/jZfAfwkuAC0tubPdhMAfVH2VUrT94rgscvpfGDoxPATdpMoma2TYgOHYtxjDHDtkDd9fZWfO205ITAWGK4hx0KeX3SGunllBg1IjAhycI3kcH4URlwJ9DMTjrGxBwbEmVltyXVbAM3HowfLD818DZPQJc4cOe2mGEvShOZJermz4AEJjfmhsj4JpbkhMBIYpSXE9J68joK6WGXGD4mMCE5ja9tBU3Tsgngxm8n1WS3sQg9xkkahPZu0vPfNurhYLEUG0TfRo8AJwYO99mNY1cGR8bf9yRfr46/GgflXjHYedwOJ9l92y9+HcBQB2EDJ6O8VYsH362HT2pErtlSOe6N98Bbaac38dMgpbK+epsuWxl+FCDT8Hl8l7sFFJzNC6pfCyin6HDlxhBIWOW736sTpI8oEDXCPRHRhPRApT8Bowvmm2+7zw0q+1+nHvBW9Vy9/62qCjH0GLKAbmP526pa+G4FFpIxlvGIfVKl1YMp8eC0XZsSknvbvefeKW7Zyidkig6gVcNZdAT3tnuvuGVrXnE36bm33XvFLa1Hyj609W+562rg3nbvuXeKW9qEfv4duLfde8UtbeFkpzKHzRnsV4ApTyufK58vj7NvVJ24fQsU2+WW9lRJd5p7jsVB3ve3D1mgR4brUJbmWfu6mpsiFuNs37F5mqt+6eQOmvK08rnyeTvOxl7G/lB5WvmcHWeHXiZtixXnueskobbo8u133uFfXD/CA7D96dgt+X6gma2OGn92aMDjSjwUE4vhW/uQWkmupj1hGbCqNlBM3NoHS0AmSlbXlMpjNA5DXO0ELgAN/vbLgBuWcFJj19dNOygm+uD4MMw02sAxiRxniJ+AvbTID8R0MgGKpsegv03hIqWS0ksjGw9BviYLbo2ORUB66XgqoMnT8RzsFPsYuGA/JgDDZ1PXgIQMEsFBM8iC08FDYl2xsQWCq4dfjn3DgQBAw2+8zWZP2Oqs/vHINwDAx/WaWwHgTzb81T7ael16Sy1AAxwAgACUxCoLNFAp1UqYmOrH981uQ9AqIBmLcRpkIV+D7hIwC42UbE2hGrKQ5BniJsMAZtTCdW2TrrvgpflUhwGE5cy2WSNrZXhGZxTWx6pOKNRhDhTd34fXabbUNQAnPQu057LsjaRmDQmEUDLadDYMLVSsp6ARjW5bYqTwZT38KSd7kWprJac8oYtRbrvx3Z8yHG6v8gonJ2Odhj9JnUoD6HpEi7G/E/x+awDn7SXkbc0JI5BC70yxt+v1PnpmDxdhQs2Z44/HU+uCRlllosS19r6acCklj71Mi+SEwbS896BNYZ2rwIqyNE9ohgS7hADHsKAAYvu883CaK8wKWbjyn28YsAlP9aYBhHRaINX2eQPeYdowgFdW3YVGMiYcF4wyQKS6BIOKnhsvDDGlp69MC+Bsn7kyR6XkusQWCudpuL6swpMHyIGBHkJLWF2lONwFLq7J8EF7WHtNjoki5MFAgH3sEcvOxwTnqVgqTwEhBwZyTMeiZdTwOamP3PuyLQInnii3PBgSAPIFGvI4Y/DA/qprvO0n2FqZjLH1vQ2ACxhzVOtMtiCj1J3tc2gk7ODF6Dnfw1vL1N8R0P6oldo+2hL4eRcEAL/whhMcQC1TSuNaZ+h6OQh1AAbAQ2BOQRDz7xQOQv49Bemo/3nU/CmcJBM4hYtSyiEPii6n8LMoriS4fsxThMTdRjnaFn79Ad4gXy2MJpI2JGB3QYmwYb6g0ZHChq+CM+5Jf4x/Vn6SMiaQF4KOdY0hJeQPo5HIEeXYDddcc9Pxs38vUx6+1CBR/HniGC6qTCdEgfrda0UiBZnwE/7wiTPOB2n0kvKCLCgyCkVHd1FtzgY/PyTbC67eTfpar99PqB7YaX3LlqbAirQaxfRRc5gIWXj+DQhsIiMxgzw6CoqZcMY3JipWx4RMxIK+TtQ+OXkr2lQeNydJZWadtHtqRwl5DqRlmdED/dLQSvYGDU/Yi8G8kzsBfDkzhYUv/f7VpglcCHcX6DwypODQydx03/5sCyg6SzkT4XNsjsgPDPEvOAYvtAjtsFpQWBvUF5AwlmabQ22zcwhX5IdS6cyvAQ4D8tu18UTOQOfA9dk5BCWMMF92Y2druwImaTuUVZNnG4tZP4Jn7YaPVpI1cKz3Nlki1QIZFGDshkbJLXNMpuQyd/kpIfXJMRXpd+KbjUogvSWAXyRDAqi+FdWEttexRNERH8I90E/2ercmH8xQh1hQLUyiDUYk8awOYXGqzcY5KhgUcADD0e5KNGgdySp0UsFIKRC16Qb5cy2RSJoMjMZg4BuUYMx5DA+uYz6Dh+jMI+2OFUGhCnirg1Az+Ky3CJOkmDHprguJm+uGVhVXOsGxCI41dHaXN2akXxlHZ/OT7Umdi2OMjhF0HGp+OErZgiqMImEPiqkDydZKs6Xlu7caQ+g+fQiEude9CBG3GTXpW+tv9hD5JUlNGMtmzkAEzpFBZZRwDIcydkrvV5UJGvbTxlq3pBstJHXYp9NaR8+/qOi2LA4z4KYuQiyQEnTmdNxG4nB6goFQhWuECG6gD6QyhyKuxc1UcYPjUziTFJrxKWquFPtBQg16TBe4PFLmpkWKinQufRa1juvLDIM8QjDwCkxdCYmLiNPoV6Xt5KgbAZ1vJmx1Gn17ZJqFbOpfmgN0OGmjKWF+Xbo/zRapBJiQUyQgHzPyeIsiyEqMC8U6l7he1clFcphGphm1+ry46I+SQISAg3fNfGCRLSM45lLHNtP2MOWmC81BGsY3bzVlHMU5jUXDEik503DdoVuzCRO3LeVA7tfcqCeZqIgM1IU6pDI5wlUjnMlZGN0kjVnqRHRq3sR0awJl+9ZORaXAQSOUBZKR1EHdR5ciJpODJahjZH9SAHZso0R/w1kYKDnJvkRZeE4XrSoCleYhidCqBZpDkSSd/CazApVWyQnfKfYAh6TkyKOhSSSgUaUKj2BjIdg9LcA5FLA7DIFvfTKCNHnrAApQwLWELv6CLayHSVOvFIOWpHTy17XiQylzMEWaUEiS7L2822g1zES3JiCi5oVkLxhSaJBUGgOG7zkAfdUoGUB9NEypej8piqjTVIjlFHCgfm7IdLODiAjq3oCN3C30axUIqAwjUBkeQpwEkQE19IKLyARjHiLIPEpPRkTggKGzkwExj2EKa4I7x17oorIt33Ay8zIPURQro6Ez1HrW9wpUewcQkZrs/hHK1/AaCV1G8PoM1mehZtqvCaFZQ1tBAuCXXw/Il0axs6jfzKm/7tmMkMpUO2mKLZ2NDcSgrRkeqBSKJJ2udj5yokSOrUT5jzx9l1vTer9WbWwYjUbUbDnzrM7iCoIVmIxbd4SSC1pwpyTXK9znGG1b1n4UCRdseH1KWLc5jcda94tU94ANCcyMWUhuSmidwfV8cgdIaTZvElBsCa4wjgxTTrKlhBYZqSczmX116o1dIXDoEIFWQ52QTE0PN9iW/8sl9n7S+a9ImEYK927AFuIVlJQfLSsj22TIqO3JkA+RPFl7r5RxLDwRqPeDjgL4zzvSTNc79OfAbhb4+lv/8h2n4h2jn+YqR6jbtLj0gtwYDhKVMUwkLjbaNfF5Rac37zGydxKzd1eGEz2l8enfR4gijsYkyjGsJI5GEJUxTCQmhmEgccli6ZGYADKtvFk7SxZhE7GowHgYVhKDgtmI2FvUOkw2hp3E0QpiPAwfiYuH4SBxSWFpkoB0nPG5Pz774DP9v/Lcu75RJQwnifExnCQmhmEhcUlhKEngRZbVJL3bc0ljKZK49LAUSIwgG4sLozvTu4fOP+sy1EF3dHWJf7eiHSfhgdlOth8nXBAqR69dIzZzlfpAv6lQ";
(function registerSfOverlayFont() {
  try {
    if (typeof document === "undefined" || !(document as any).fonts || typeof FontFace === "undefined") return;
    const FAM = "SF Overlay";
    let present = false;
    (document as any).fonts.forEach((f: any) => { if (f && f.family === FAM) present = true; });
    if (present) return;
    const ff = new FontFace(FAM, `url(data:font/woff2;base64,${SF_OVERLAY_WOFF2_B64}) format("woff2")`, { style: "normal", weight: "400" });
    ff.load().then((f) => (document as any).fonts.add(f)).catch(() => {});
  } catch (e) { /* non-fatal: fall back to the system font */ }
})();

interface HassEntity {
  entity_id?: string;
  state: string;
  attributes: Record<string, any>;
  last_changed?: string;
  last_updated?: string;
}
interface HassEntityRegistryEntry {
  device_id?: string;
}
interface HassDevice {
  name?: string;
  name_by_user?: string;
  via_device_id?: string;
}
interface Hass {
  states: Record<string, HassEntity>;
  entities?: Record<string, HassEntityRegistryEntry>;
  devices?: Record<string, HassDevice>;
  callService: (domain: string, service: string, data?: Record<string, any>) => void;
  formatEntityState?: (e: HassEntity) => string;
}
interface CardConfig {
  type: string;
  panel?: string;
  outlets?: string[];
  title?: string;
  accent?: string;
  default_tab?:
    | "overview" | "environment" | "outlets" | "outlets_log" | "device_log" | "vpd"
    | "calibration" | "alerts" | "log";
}
interface OutletSlot {
  days: number[];   // 0=Sun … 6=Sat
  start: string;    // "HH:MM"
  end: string;
}

const CARD_VERSION = "__CARD_VERSION__";
const ACCENT_DEFAULT = "#ff7a1a";
// Per-probe line colours for the multi-line soil history graph (the average line
// is drawn in the card accent, thicker, on top). Cycled by probe order. (v0.21.74)
const SOIL_LINE_COLORS = ["#5dcaa5", "#85b7eb", "#ef9f27", "#ed93b1", "#b39ddb", "#4dd0e1", "#f06292", "#9ccc65"];
// Title-case DISPLAY labels for the Environment run-mode dropdown. Only the shown
// text changes — the <option> value stays the integration's canonical string, so
// the command path is untouched. Keyed lower-case so it matches whatever casing
// the entity publishes. (v0.21.77)
const RUN_MODE_LABELS: Record<string, string> = {
  "prioritize temperature": "Prioritize Temperature",
  "prioritize humidity": "Prioritize Humidity",
  "temperature only": "Temperature Only",
  "humidity only": "Humidity Only",
  "temperature & humidity": "Temperature & Humidity",
};
const DAY_LETTERS = ["S", "M", "T", "W", "T", "F", "S"];   // 0=Sun … 6=Sat

const SLOT_RE = /^sf_(dp\d+|ac5|ac10|st\d+)_/;

function objectId(entityId: string): string {
  return entityId.split(".")[1] ?? "";
}

// Point on a circle at a screen-space angle (deg, 0 = right, +cw with y down).
function polar(cx: number, cy: number, r: number, deg: number): [number, number] {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}
// Arc path over a 270° dial (135° start, gap at the bottom) for fractions f0..f1.
function arcPath(cx: number, cy: number, r: number, f0: number, f1: number): string {
  const a0 = 135 + f0 * 270;
  const a1 = 135 + f1 * 270;
  const [x0, y0] = polar(cx, cy, r, a0);
  const [x1, y1] = polar(cx, cy, r, a1);
  const large = a1 - a0 > 180 ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

// Decimal places implied by a step: 0.1 -> 1, 10 -> 0, 1 -> 0.
function stepDecimals(step: number): number {
  const s = String(step);
  const dot = s.indexOf(".");
  return dot >= 0 ? s.length - dot - 1 : 0;
}

// Live value bubble that follows a range slider's thumb while it is dragged.
// Attached as @input; reads data-unit (suffix) and data-off ("1" -> show "off"
// at the minimum). The bubble element must be the input's next sibling inside
// a `.sl-live` wrapper. Updating the DOM directly here (not via Lit) keeps the
// preview live during the drag; the entity is only written on @change.
function sliderBubble(ev: Event) {
  const el = ev.currentTarget as HTMLInputElement;
  const bub = el.parentElement?.querySelector<HTMLElement>(".sl-bub");
  if (!bub) return;
  const min = Number(el.min || "0");
  const max = Number(el.max || "100");
  const v = Number(el.value);
  const frac = max > min ? (v - min) / (max - min) : 0;
  const decimals = stepDecimals(Number(el.step || "1"));
  const text = Number.isFinite(v) ? v.toFixed(decimals) : el.value;
  bub.textContent =
    el.dataset.off === "1" && v <= min ? "off" : `${text}${el.dataset.unit ?? ""}`;
  bub.style.left = `calc(${frac} * (100% - 18px) + 9px)`;
}

// Reusable CSS for the slider + live bubble; spread into each card's styles.
const SLIDER_BUBBLE_CSS = css`
  .sl-live {
    position: relative; flex: 1 1 auto; min-width: 0;
    display: flex; align-items: center;
  }
  .sl-live > input[type="range"] { flex: 1; min-width: 0; width: 100%; }
  .sl-bub {
    position: absolute; bottom: calc(100% + 6px); transform: translateX(-50%);
    padding: 1px 7px; border-radius: 8px; font-size: 12px; font-weight: 600;
    line-height: 1.5; white-space: nowrap; pointer-events: none;
    opacity: 0; transition: opacity 0.1s ease;
    background: var(--primary-color, #3391ff);
    color: var(--text-primary-color, #fff);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3); z-index: 3;
  }
  .sl-live > input[type="range"]:active ~ .sl-bub,
  .sl-live > input[type="range"]:focus-visible ~ .sl-bub { opacity: 1; }
`;

function discoverSlots(hass: Hass): string[] {
  const slots = new Set<string>();
  for (const eid of Object.keys(hass.states)) {
    const m = objectId(eid).match(SLOT_RE);
    if (m) slots.add(m[1]);
  }
  return [...slots].sort();
}

function panelSlots(hass: Hass): string[] {
  return discoverSlots(hass).filter((s) =>
    // A power strip (AC5/AC10) or single-plug S-Station may have only outlets
    // (no sensors/lights) yet is still its own card — treat any ac/st strip
    // with an outlet as a selectable panel. (AC10 with no climate accessory
    // was wrongly excluded when this only matched "st". v0.21.24)
    (/^(ac|st)\d/.test(s) && !!hass.states[`switch.sf_${s}_outlet_1`]) ||
    Object.keys(hass.states).some((eid) => {
      const o = objectId(eid);
      return (
        o === `sf_${s}_temperature` ||
        o === `sf_${s}_soil_avg_temperature` ||
        o === `sf_${s}_light_1` ||
        o === `sf_${s}_fan` ||
        o === `sf_${s}_blower`
      );
    })
  );
}

function outletSlots(hass: Hass): string[] {
  return discoverSlots(hass).filter(
    (s) => !!hass.states[`switch.sf_${s}_outlet_1`]
  );
}

// A CORE entity for a slot — one on the device's MAIN device, not a sub-device
// like the Environment device (sf_{slot}_env_*), whose id a nested strip's
// via_device does NOT point at.
function coreEntityForSlot(hass: Hass, slot: string): string | undefined {
  const prefix = `sf_${slot}_`;
  const keys = Object.keys(hass.states);
  return (
    keys.find((k) => objectId(k) === `sf_${slot}_temperature`) ??
    keys.find((k) => {
      const o = objectId(k);
      return o.startsWith(prefix) && !o.startsWith(`sf_${slot}_env_`);
    })
  );
}

// Device id backing a slot (its MAIN device, from the entity registry).
function deviceIdForSlot(hass: Hass, slot: string): string | undefined {
  const eid = coreEntityForSlot(hass, slot);
  return eid ? hass.entities?.[eid]?.device_id : undefined;
}

// Outlet-bearing strips nested UNDER this panel (their device via_device is the
// panel) — e.g. an AC5/AC10 hosted by a Display Panel. Excludes the panel itself:
// a standalone strip renders its own outlets directly and must not list itself as
// a nested device. Returns [] when nothing is nested, so the picker/section hides.
function nestedOutletSlots(hass: Hass, panelSlot?: string): string[] {
  if (!panelSlot) return [];
  const panelDevId = deviceIdForSlot(hass, panelSlot);
  if (!panelDevId) return [];
  return outletSlots(hass).filter((s) => {
    if (s === panelSlot) return false;   // the panel's own outlets aren't "nested"
    const devId = deviceIdForSlot(hass, s);
    const dev = devId ? hass.devices?.[devId] : undefined;
    return dev?.via_device_id === panelDevId;
  });
}

function slotDeviceName(hass: Hass | undefined, slot?: string): string {
  if (!hass || !slot) return "";
  const eid = coreEntityForSlot(hass, slot);
  if (!eid) return "";
  const devId = hass.entities?.[eid]?.device_id;
  const dev = devId ? hass.devices?.[devId] : undefined;
  if (dev) return dev.name_by_user || dev.name || "";
  const fn: string = hass.states[eid].attributes.friendly_name || "";
  const m = fn.match(/^(SF .+? [0-9A-Fa-f]{4})\b/);
  return m ? m[1] : "";
}

// Phase 2 — one Overview tile with its stable id, for movable-tile ordering.
// `full` = spans the whole grid width (used for quick-toggle rows in unified mode).
// `pop` = this tile's expansion (graph / detail), rendered full-width right under
// the tile when it's the open one (instead of at the bottom of the grid).
type TileItem = { id: string; tpl: unknown; full?: boolean; pop?: unknown };

const PARAMS: [string, string, string][] = [
  ["temperature", "Air Temp", "mdi:thermometer"],
  ["humidity", "Air Humi", "mdi:water-percent"],
  ["vpd", "Air VPD", "mdi:water-opacity"],
  ["leaf_vpd", "Leaf VPD", "mdi:leaf"],
  ["co2", "CO2", "mdi:molecule-co2"],
  ["ppfd", "PPFD", "mdi:white-balance-sunny"],
  ["soil_avg_temperature", "Soil Temp", "mdi:thermometer"],
  ["soil_avg_moisture", "Moisture", "mdi:water"],
  ["soil_avg_ec", "Soil EC", "mdi:flash"],
];

// Overview tile suffix -> alarm-threshold key (in the alarm_settings block), so
// a live reading can be compared against its own min/max for the out-of-range
// tile colouring (Settings tab).
const PARAM_ALARM: Record<string, string> = {
  temperature: "temp",
  humidity: "humi",
  vpd: "vpd",
  co2: "co2",
  ppfd: "ppfd",
  soil_avg_temperature: "tempSoil",
  soil_avg_moisture: "humiSoil",
  soil_avg_ec: "ECSoil",
};
// Overview tile suffix -> environment-target metric prefix, for target-aware
// colouring (compares the reading to the active day/night target ± dead zone).
// Only Temp / Humidity / CO2 have environment targets.
const PARAM_ENV_TARGET: Record<string, string> = {
  temperature: "temp",
  humidity: "humi",
  co2: "co2",
};
const ALARM_HI = "#ff6b6b";   // above max (default) / offline + fault (fixed)
const ALARM_LO = "#45b6ff";   // below min (default)
const ALARM_IN = "#4caf7d";   // in range (default)
const ALARM_WARN = "#ffb300"; // near edge — target ± dead zone margin (default)
const ALARM_HI_BG = "rgba(255,107,107,0.16)";   // offline / fault tile fill
// Translucent tile-fill version of a solid highlight colour (#rrggbb -> rgba).
const tint = (hex: string, a = 0.16): string => {
  const m = /^#?([0-9a-fA-F]{6})$/.exec((hex || "").trim());
  if (!m) return `rgba(255,107,107,${a})`;
  const n = parseInt(m[1], 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
};
const isHex6 = (v: unknown): v is string =>
  typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v);
type ColorMode = "off" | "tile" | "text";
type ColorSource = "alarms" | "targets" | "both";
const isColorSource = (v: unknown): v is ColorSource =>
  v === "alarms" || v === "targets" || v === "both";

// Default outlet-by-mode colours: Manual = accent, Scheduled = blue,
// Environment = green, Drip = cyan.
const OC_MANUAL = ACCENT_DEFAULT;
const OC_SCHED = "#45b6ff";
const OC_ENV = "#4caf7d";
const OC_DRIP = "#3cc8d0";
// Per-outlet-mode config field suffixes (mirrors entity_defs.build_outlet_mode_config),
// so the pop shows only the *staged* mode's controls even before the device switches.
const OUTLET_MODE_FIELDS: Record<string, string[]> = {
  "Time Slot": ["ts_type", "ts_start", "ts_stop"],
  "Cycle": ["cycle_start", "cycle_run", "cycle_off", "cycle_times"],
  "Temperature": ["temp_device"],
  "Humidity": ["humidity_device"],
  "CO2": ["co2_device"],
  "Drip Irrigation": ["drip_soil", "drip_avg"],
  "Manual": [],
};
// S-Station single-socket "Device Type" — the app's flat 10-option dropdown.
// Each maps to the outlet mode + config (direction / dev_type index) the card
// writes via sf.set_outlet_config. Blower's mode is refined by its sub-dropdown.
const ST_DEVICE_TYPES: { label: string; mode: string; cfg: Record<string, string> }[] = [
  { label: "General device",   mode: "Manual",                        cfg: { dev_type: "0" } },
  { label: "Timer period",     mode: "Time Slot",                     cfg: { dev_type: "1" } },
  { label: "Timer loop",       mode: "Cycle",                         cfg: { dev_type: "2" } },
  { label: "Blower",           mode: "Blower (Temperature Priority)", cfg: { dev_type: "3" } },
  { label: "Humidification",   mode: "Humidity",  cfg: { dev_type: "4", humidity_device: "Humidifying" } },
  { label: "Dehumidification", mode: "Humidity",  cfg: { dev_type: "5", humidity_device: "Dehumidifying" } },
  { label: "Heater",           mode: "Temperature", cfg: { dev_type: "6", temp_device: "Heating" } },
  { label: "Cooler",           mode: "Temperature", cfg: { dev_type: "7", temp_device: "Cooling" } },
  { label: "CO2 Injection",    mode: "CO2",  cfg: { dev_type: "8", co2_device: "Aeration" } },
  { label: "Exhaust fan",      mode: "CO2",  cfg: { dev_type: "9", co2_device: "Exhaust" } },
  // Integration-driven (no device dev_type): follows the env day/night cycle.
  { label: "Light Env",        mode: "Light Env", cfg: {} },
];
const ST_BLOWER_MODE: Record<string, string> = {
  "Temperature Priority": "Blower (Temperature Priority)",
  "Humidity Priority": "Blower (Humidity Priority)",
};
// Appliance types that just show an info note (thresholds come from Environment).
const ST_APPLIANCE_NOTE = new Set([
  "Blower", "Humidification", "Dehumidification", "Heater", "Cooler",
  "CO2 Injection", "Exhaust fan",
]);

// Outlet mode -> colour group.
const outletGroup = (mode: string): "manual" | "sched" | "env" | "drip" =>
  mode === "Time Slot" || mode === "Cycle" ? "sched"
  : mode === "Temperature" || mode === "Humidity" || mode === "CO2"
    || mode === "Light Env" ? "env"
  : mode === "Drip Irrigation" ? "drip"
  : "manual";

// Default device-by-mode colours: Manual = accent, Scheduled = blue, Auto = green.
const DC_MANUAL = ACCENT_DEFAULT;
const DC_SCHED = "#45b6ff";
const DC_AUTO = "#4caf7d";
// Device mode -> colour group. Auto covers the sensor-driven / PPFD modes.
const deviceModeGroup = (mode: string): "manual" | "sched" | "auto" =>
  mode === "Time Slot" || mode === "Cycle" ? "sched"
  : mode === "Environment" || mode === "Temperature" || mode === "Humidity" || mode === "PPFD" || mode === "PPFD - Plan" ? "auto"
  : "manual";

// A reading is "offline" when its entity is unavailable/unknown — e.g. a soil
// probe unplugged (its entities go unavailable, v3.19.57).
const isOffline = (e?: HassEntity): boolean =>
  !!e && (e.state === "unavailable" || e.state === "unknown");

// "HH:MM" -> minutes since midnight (null if not a valid time).
const hhmmToMin = (v?: string): number | null => {
  const m = (v || "").match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = +m[1], mm = +m[2];
  return h <= 23 && mm <= 59 ? h * 60 + mm : null;
};

// PPFD above this (µmol) during the night cycle counts as a light leak. A real
// sensor floats a small non-zero floor in the dark, so 1 is effectively "any
// light" without tripping on a flat-zero reading.
const LEAK_PPFD = 1;
// Lowest valid PPFD target (µmol). 0 isn't a target — a light is turned off with
// its on/off toggle, not by a 0 target — so the plan editor's dropdown floors at
// 20 and an unset/0 target is shown as this floor everywhere. (v0.21.59)
const PPFD_TARGET_MIN = 20;
const CYCLE_DAY = "#e0a83a";     // sun badge
const CYCLE_NIGHT = "#8f9bd4";   // moon badge

// Standardized commit controls used by every Save/Discard prompt across the
// card (device tiles, Environment, Calibration, Outlets, Settings, Alerts, and
// the SE-light schedule). One wording ("Apply"/"Discard"), one order (primary
// left, secondary right), one style — disabled until there's a staged change.
const commitButtons = (
  accent: string, dirty: boolean, onApply: () => void, onDiscard: () => void,
  saving = false
) => html`
  <button class="save-btn" ?disabled=${!dirty || saving}
    style=${dirty && !saving ? `background:${accent}` : ""}
    @click=${onApply}>${saving ? html`<span class="save-spin"></span>Saving…` : "Apply"}</button>
  <button class="discard-btn" ?disabled=${!dirty || saving}
    @click=${onDiscard}>Discard</button>`;
const commitBar = (
  accent: string, dirty: boolean, onApply: () => void, onDiscard: () => void,
  extraClass = "", saving = false
) => html`<div class="save-bar ${extraClass}">
  ${commitButtons(accent, dirty, onApply, onDiscard, saving)}
</div>`;

const LIGHTS: [string, string, string][] = [
  ["light_1", "Light 1", "mdi:lightbulb"],
  ["light_2", "Light 2", "mdi:lightbulb"],
];
const FANS: [string, string, string][] = [
  ["fan", "Fan", "mdi:fan"],
  ["blower", "Blower", "mdi:weather-windy"],
];
const CLIMATE: [string, string, string][] = [
  ["heater", "Heater", "mdi:radiator"],
  ["humidifier", "Humidifier", "mdi:air-humidifier"],
  ["dehumidifier", "Dehumidifier", "mdi:air-humidifier-off"],
];

const ENV_ROWS: [string, string, string, string, string][] = [
  ["Temperature", "env_temp_day", "env_temp_night", "env_temp_deadband", "mdi:thermometer"],
  ["Humidity", "env_humi_day", "env_humi_night", "env_humi_deadband", "mdi:water-percent"],
  ["CO2", "env_co2_day", "env_co2_night", "env_co2_deadband", "mdi:molecule-co2"],
];
const MAX_OUTLETS = 10;

export class SpiderFarmerCard extends LitElement {
  @property({ attribute: false }) hass?: Hass;
  @state() private config!: CardConfig;
  @state() private tab:
    "overview" | "env" | "outlets" | "olog" | "dlog" | "vpd" | "cali" | "alerts" | "log" | "settings" = "overview";
  // Environment tab sub-view: null = follow the default (Planting Plan when a
  // plan is active, else Environment); set when the user taps the toggle.
  @state() private envSubView: "env" | "plan" | null = null;
  // Plan editor working copy (null = not editing). Each entry is one stage in
  // display units: {stageId, label, start:"YYYY-MM-DD", end:"YYYY-MM-DD",
  // temp_day/night/dz, humi_day/night/dz, co2_day/night/dz, light1, light2}.
  @state() private planDraft: any[] | null = null;
  // Which stage index the single-stage editor is open on (null = plan read view).
  @state() private planEditStage: number | null = null;
  // Read view: show every stage, or just the current one (with a "show more").
  @state() private planShowAll = false;
  // Planting-plan template picker: null (hidden), "new" (seed a fresh plan) or
  // "append" (add a template stage to the current draft). planTplName is the
  // working name for saving the current draft as a My-template.
  @state() private planTplOpen: null | "new" | "append" = null;
  @state() private planTplName = "";
  // Transient "Template saved" confirmation shown next to the Save-as-template button.
  @state() private _tplMsg = "";
  private _tplMsgT: any = null;
  // Two-step confirm for deleting the stage being edited (prevents mis-taps).
  @state() private planDelArm = false;
  // Enabling/disabling a plan takes the controller a few seconds to apply; show a
  // "Starting/Stopping — Please Wait" state on the button until the plan sensor
  // reflects the new state (or a safety timeout fires). (v0.21.58)
  @state() private _planPending: "" | "start" | "stop" = "";
  private _planPendTimer?: ReturnType<typeof setTimeout>;
  // Out-of-range highlight mode + the colour used above max / below min.
  @state() private colorMode: ColorMode = "off";
  @state() private colHi: string = ALARM_HI;
  @state() private colLo: string = ALARM_LO;
  // In-range highlight mode + colour (colours readings within their limits).
  @state() private colorModeIn: ColorMode = "off";
  @state() private colIn: string = ALARM_IN;
  // Near-edge colour — a reading inside the target ± dead-zone *margin* (target
  // colouring only). Follows the out-of-range mode (it's a warning).
  @state() private colWarn: string = ALARM_WARN;
  // What drives the tile out-of-range highlight: the controller alarm thresholds
  // (Alerts tab), the environment day/night target ± dead zone, or Both (alarm
  // wins, else target). Default "alarms" = pre-3.19.107 behaviour.
  @state() private colorSource: ColorSource = "alarms";
  // Overview tile extras (each an independent, persisted toggle).
  @state() private showTrend = false;    // up/down/flat arrow from recent history
  @state() private showBand = false;     // dead-zone band under the tile
  @state() private showTargets = true;   // "target …" / "range …" line on tiles
  @state() private tileSummary = false;  // device tiles: mode + settings summary line
  @state() private hour12 = false;       // show tile schedule times as 12h AM/PM
  @state() private customOutletNames = false;  // Outlets tab: use editable custom names
  @state() private outletNames: Record<string, string> = {};  // `${slot}_${n}` -> custom name
  // Header connection info: online dot + signal bars (from the controller's Wi-Fi
  // rssi, exposed as an alarm_settings attribute). connSignal lets you point at a
  // different signal_strength entity (another AP / a router integration) when the
  // controller isn't on the bundled Wi-Fi AP.
  @state() private showConn = false;         // show online + signal in the header
  @state() private connCustom = false;       // use a custom signal entity instead
  @state() private connSignal = "";          // custom rssi/signal entity_id (dBm)
  // Outlets Log tab: per-outlet on/off timeline from the switch's recorder
  // history (green = on). Gated on hasOutlets + this toggle.
  @state() private showOutletsLog = false;
  // VPD graph tab: temperature×humidity phase grid + trend line. Gated on this
  // toggle. vpdLeaf adds the leaf-VPD reading/marker alongside air VPD.
  @state() private showVpd = false;
  @state() private showLeafVpd = true;   // show the Leaf VPD tile + its settings
  @state() private _colorOpen = false;    // Settings: colours + tile appearance collapsed by default
  @state() private _tsOpen = false;       // Settings: Temperature source collapsed by default
  @state() private _cdOpen = false;       // Settings: Dehumidifier cooldown timer collapsed by default
  // Settings: the remaining sections, collapsed by default to cut initial clutter.
  @state() private _setOverviewOpen = false;
  @state() private _setExtrasOpen = false;
  @state() private _setConnOpen = false;
  @state() private _setVpdOpen = false;
  @state() private _setDevOpen = false;
  @state() private _setOutletOpen = false;
  @state() private _setLayoutOpen = false;
  @state() private vpdLeaf = false;
  // Ephemeral VPD tab UI state (not persisted): current growth stage, view,
  // highlight-band toggle, target source, and the custom band bounds (kPa).
  @state() private vpdStage: "prop" | "veg" | "flower" | "custom" = "veg";
  @state() private vpdView: "grid" | "trend" = "grid";
  @state() private vpdHighlight = false;
  @state() private vpdPlanSource = false;
  private vpdCustom: [number, number] = [1.0, 1.4];
  @state() private ologRange = 24;                 // hours: 1 / 6 / 12 / 24 / 168 (7d)
  @state() private ologOpen: string | null = null; // expanded outlet key
  private _olog: Record<string, { t: number; on: boolean }[]> = {};  // eid -> transitions
  private _ologLoading: Record<string, boolean> = {};
  @state() private _ologVer = 0;                   // bumped when a fetch lands
  // Brief "Saving…" feedback on the Apply bars after Apply is pressed.
  @state() private _saving = false;
  private _savingT: any = null;
  private _savingAt = 0;   // when Apply was pressed (ms), to confirm-clear _saving
  // Entities whose state we expect to change when the write lands; hold "Saving…"
  // until one of them actually changes (the value/toggle physically moves).
  private _savingWatch: { id: string; was: string }[] = [];
  // Copy-an-outlet's-config-to-others UI (in the outlet pop).
  @state() private outletCopyOpen = false;
  @state() private outletCopySel: Record<string, boolean> = {};   // target key -> selected
  @state() private outletCopyFromOpen = false;   // "Copy from…" picker (pull config in)
  // Quick-toggle outlets row (Settings-gated). Remember: restore the outlet's
  // last mode/config on quick-on instead of a bare on/off (default off).
  @state() private showOutletQuick = false;
  @state() private outletQuickRemember = false;
  @state() private outletQuickNames = false;   // quick buttons show N-Name (named) / number
  // In-memory fast-path cache of quick-toggle remembered outlet snapshots, keyed
  // by outletRememberKey. The durable copy lives server-side in the panel's
  // card_options (via sf.set_card_option), so remember/restore survives reloads
  // and works across devices; memory is just a same-session shortcut.
  private _olqMem: Record<string, { mode: string; config: Record<string, string>; periods?: any }> = {};
  // Device Log tab + device quick-toggle row (mirrors the outlet features). The
  // Device Log reuses the same recorder-history machinery keyed by the device's
  // power entity id. deviceQuickRemember restores a device's mode (which re-engages
  // the controller's stored settings for that mode) on quick-on.
  @state() private showDeviceLog = false;
  @state() private showDeviceQuick = false;
  @state() private deviceQuickRemember = false;
  @state() private dlogOpen: string | null = null; // expanded device key (shares ologRange window)
  // In-memory fast-path cache of device quick-toggle snapshots (mode). Durable copy
  // lives in the panel's card_options (dlq_<suffix>).
  private _dlqMem: Record<string, { mode: string }> = {};
  // Optimistic "quick-toggling off" window per device suffix (expiry ms). A
  // scheduled device is dropped to Manual before powering off, which would briefly
  // paint the tile in the Manual colour; while this is set the tile renders OFF so
  // that intermediate Manual flash never shows.
  // Optimistic ("opportunistic") device on/off: keyed by device suffix, each entry
  // is the target state {on} the user just asked for plus an expiry. While present
  // the tile / quick-row paint that target immediately instead of the (briefly
  // stale) live state, so a toggle or Apply never bounces back before the device
  // reports in. Cleared early once the live state matches (willUpdate) and hard-
  // capped by an 8s timeout if the change is slow or rejected. (v0.21.66)
  @state() private _devPend: Record<string, { on: boolean; until: number }> = {};
  // Optimistic staged LEVEL (fan/blower speed %, light brightness %) held after Apply so
  // the dropdown/slider doesn't bounce to the stale live value during "Saving…". Keyed by
  // entity_id; cleared once the device reports the applied value (willUpdate) or after 8s.
  @state() private _pendLevel: Record<string, { pct: number; until: number }> = {};
  // Same optimistic on/off for OUTLET tiles + quick-toggles, keyed by the outlet
  // switch entity id (switch.sf_<slot>_outlet_<n>). The outlet pop's Apply fires the
  // switch service then clears the draft, so the tile would otherwise snap back to
  // the briefly-stale live state before the device reports in — the bounce. (v0.21.68)
  @state() private _outPend: Record<string, { on: boolean; until: number }> = {};
  // Dehumidifier compressor cooldown (v0.21.35): a 1s ticker drives the live
  // countdown on the tile while the 3-min lockout is active.
  @state() private _cdTick = 0;
  private _cdTimer?: ReturnType<typeof setInterval>;
  // Real on->off transitions this card session (switch entity_id -> epoch ms of
  // the off). A switch's own last_changed resets to the HA boot time on restart,
  // so a device that never ran looked like it "just turned off" and showed a
  // phantom lockout after a reboot. We trust a witnessed transition over
  // last_changed; last_changed is only a fallback while a lockout is actively
  // demanded. (v0.21.55)
  private _cdOffAt: Record<string, number> = {};
  private _cdLastState: Record<string, string> = {};
  // Custom layout (Phase 1): overall scale + tiles-per-row. Storage is a single
  // `layout` blob so re-ordering can drop in later without a new option.
  @state() private customLayout = false;
  @state() private cardScale = 100;   // percent, 70–150
  @state() private tileCols = 3;      // tiles per row, 2–5
  // Phase 2 — movable tiles. layoutMode "sections" = reorder within each
  // grid (Parameters/Devices/Outlets separate); "unified" = one merged free-move
  // panel. tileOrder holds stable tile-ids per section (unified uses `all`).
  @state() private layoutMode: "sections" | "unified" = "sections";
  // Free-move (unified) extras: show the device / outlet quick-toggle rows as
  // movable full-width bars in the panel (Phase 2 slice 3.5). Unified mode only.
  @state() private unifiedDeviceQuick = false;
  @state() private unifiedOutletQuick = false;
  @state() private tileOrder: {
    params: string[]; devices: string[]; outlets: string[]; all: string[];
  } = { params: [], devices: [], outlets: [], all: [] };
  // Phase 2 rearrange UI: ephemeral drag-to-reorder mode on Overview.
  // reorderMode = drag handles shown + tap actions suppressed. tileOrderDraft =
  // working copy (full explicit id lists of present tiles) staged until Apply.
  // dragId/dragSec = the tile being dragged (for styling + same-section guard).
  @state() private reorderMode = false;
  @state() private tileOrderDraft: {
    params: string[]; devices: string[]; outlets: string[]; all: string[];
  } | null = null;
  // Baseline snapshot taken when rearrange opens (the saved effective order), so
  // the Apply bar's dirty state = draft differs from what was showing on entry.
  @state() private tileOrderBase: {
    params: string[]; devices: string[]; outlets: string[]; all: string[];
  } | null = null;
  @state() private dragId: string | null = null;
  private dragSec = "";
  // Hidden tiles (server-saved): a set of tile ids removed from Overview. Toggled
  // via the eye icon in Rearrange mode; hidden tiles collect in a "Hidden" tray at
  // the bottom of Rearrange so they can be restored. hiddenDraft is the working
  // copy while rearranging, committed on Apply. (v0.21.86)
  @state() private hiddenTiles: Record<string, boolean> = {};
  @state() private hiddenDraft: Record<string, boolean> | null = null;
  // Tile appearance (global, server-saved): corner radius / border / background.
  @state() private tileRadius = 12;    // px, 0–20
  @state() private tileBorderW = 1;    // px, 0–4
  @state() private tileBorderCol = ""; // "" = default hairline border
  @state() private tileBg = "";        // "" = default surface
  // Which tile categories the tile-appearance styling applies to (server-saved).
  // Default true for all — matches the original global behaviour.
  @state() private taTiles = true;     // sensor / environment tiles
  @state() private taDevices = true;   // climate / fan / blower device tiles
  @state() private taOutlets = true;   // outlet tiles
  // Dehumidifier compressor cooldown display (server-saved). Off by default; the
  // duration is configurable and it can show on the device tile and/or outlets.
  @state() private cooldownShow = false;
  @state() private cooldownDevice = true;
  @state() private cooldownOutlet = false;
  @state() private cooldownSecs = 180;   // lockout length, seconds (30–900)
  // Show the outlet tiles on the Overview tab (under Devices) for an all-in-one
  // view — server-saved. Off by default. (v0.21.43)
  @state() private outletsOnOverview = false;
  // Show the outlet quick-toggle row on the Overview tab (server-saved). (v0.21.53)
  @state() private outletQuickOverview = false;
  // Hide the S-Station / metered-plug Energy Usage tile (server-saved). (v0.21.53)
  @state() private hideEnergyTile = false;
  // Temperature source for an outlet-only strip (server-saved, mirrored from the
  // integration): "sf" = the strip's own sensor; "external" = a 3rd-party HA
  // temp/humidity entity mirrored onto the strip (v0.21.25).
  @state() private tempSource = "sf";
  @state() private extTemp = "";        // external temperature entity_id
  @state() private extHumi = "";        // external humidity entity_id
  // Smart control config (server-saved, mirrored from the integration): the
  // closed-loop humidity->dehumidifier controller. {} = not configured. (v0.21.28)
  @state() private _smartOpen = false;
  @state() private smart: Record<string, any> = {};
  // Which tile's inline history graph is expanded (suffix), and its fetch cache.
  @state() private paramOpen: string | null = null;
  private _hist: Record<string, { t: number; v: number }[]> = {};   // eid -> samples
  private _graph: Record<string, { t: number; v: number }[]> = {};  // eid -> history
  private _graphLoading: Record<string, boolean> = {};
  private _graphAt: Record<string, number> = {};   // eid -> last fetch time (ms), for staleness re-fetch
  private _graphTimer: number | null = null;        // periodic refresh while a graph is open
  @state() private _graphVer = 0;   // bumped when an async history fetch lands
  @state() private graphRange = 6;   // tile-graph window in hours (6/12/24/168), server-saved
  // Which metric the S-Station power graph plots: power/voltage/current/energy. (v0.21.85)
  @state() private powerMetric = "power";
  @state() private _graphSel: number | null = null;  // hover cursor TIME (ms) — value read at that time
  @state() private _graphPin: number | null = null;  // pinned cursor TIME (click) — survives leave
  // Hide the Light 2 device tile — for controllers that report a phantom second
  // light (e.g. an inline adapter on the port with no actual light attached).
  @state() private hideLight2 = false;
  // Colour an active outlet tile by its mode group (off = current accent look).
  @state() private outletColorMode: ColorMode = "off";
  @state() private ocManual: string = OC_MANUAL;
  @state() private ocSched: string = OC_SCHED;
  @state() private ocEnv: string = OC_ENV;
  @state() private ocDrip: string = OC_DRIP;
  // Colour an active device tile by its mode group (a fault always overrides).
  @state() private deviceColorMode: ColorMode = "off";
  @state() private dcManual: string = DC_MANUAL;
  @state() private dcSched: string = DC_SCHED;
  @state() private dcAuto: string = DC_AUTO;
  // Whether we've adopted the server-persisted display options this session (or
  // the user has made a local pick). Gates the one-time server -> local sync.
  private _colorSynced = false;
  // Staged Settings edits (null = no pending change). Any subset of the display
  // options; applied + persisted only when Apply is pressed.
  @state() private colorDraft: {
    mode?: ColorMode; modeIn?: ColorMode; hi?: string; lo?: string; in?: string;
    source?: ColorSource; warn?: string;
    showTrend?: boolean; showBand?: boolean; showTargets?: boolean;
    tileSummary?: boolean; hour12?: boolean;
    hide2?: boolean; omode?: ColorMode; customNames?: boolean;
    customLayout?: boolean; scale?: number; cols?: number;
    layoutMode?: "sections" | "unified";
    unifiedDeviceQuick?: boolean; unifiedOutletQuick?: boolean;
    ocManual?: string; ocSched?: string; ocEnv?: string; ocDrip?: string;
    dmode?: ColorMode; dcManual?: string; dcSched?: string; dcAuto?: string;
    showConn?: boolean; connCustom?: boolean; connSignal?: string;
    showOutletsLog?: boolean; showOutletQuick?: boolean; outletQuickRemember?: boolean; outletQuickNames?: boolean;
    showVpd?: boolean; vpdLeaf?: boolean; showLeafVpd?: boolean;
    showDeviceLog?: boolean; showDeviceQuick?: boolean; deviceQuickRemember?: boolean;
    tileRadius?: number; tileBorderW?: number; tileBorderCol?: string; tileBg?: string;
    taTiles?: boolean; taDevices?: boolean; taOutlets?: boolean;
    cdShow?: boolean; cdDevice?: boolean; cdOutlet?: boolean; cdSecs?: number;
    ovOutlets?: boolean; ovQuick?: boolean; hideEnergy?: boolean;
    tsSource?: string; tsTemp?: string; tsHumi?: string;
    sc?: Record<string, any>;
  } | null = null;
  // Working copy of the alarm thresholds while editing the Alerts tab (null = synced).
  @state() private alertsDraft: any = null;
  // Which soil metric's per-probe breakdown is expanded on Overview (or null).
  @state() private soilOpen: "temperature" | "moisture" | "ec" | null = null;
  // Which soil metric's multi-line history graph (one line per probe + average)
  // is open on Overview (or null). Independent of soilOpen — the tile body taps
  // the numeric breakdown, the chart icon opens this graph. (v0.21.74)
  @state() private soilGraphOpen: "temperature" | "moisture" | "ec" | null = null;
  // "All Soil Sensors Stats" table expanded (Overview, 2+ probes).
  @state() private soilAllOpen = false;
  // Which device tile's controls are expanded on Overview ("domain:suffix" or null).
  @state() private deviceOpen: string | null = null;
  // Which device tile's level history graph is open ("domain:suffix" or null).
  // Independent of deviceOpen — the chart icon opens this, the tile body opens
  // the controls. (v0.21.75)
  @state() private deviceGraphOpen: string | null = null;
  @state() private outletOpen: string | null = null;
  // Staged (not-yet-committed) device settings, keyed by entity id. Filled by
  // the schedule/cycle/environment inputs; flushed as one atomic bundle by Save.
  @state() private draft: Record<string, string> = {};
  // Optimistic mode-select picks, keyed by mode entity id. Lets the tile switch
  // its body immediately instead of waiting for the device round-trip; cleared
  // by willUpdate once the entity state confirms.
  @state() private modePick: Record<string, string> = {};
  // Optimistic env-outlet direction (Cooling/Heating/Humidifying/Dehumidifying)
  // held per "slot_n" the moment Apply fires, so the tile's sub-mode line shows
  // instantly instead of waiting for the integration's config confirm-poll to
  // publish the *_temp_device / *_humidity_device select. Live state wins once
  // it lands; a stale value is ignored because it only fills a blank.
  @state() private dirPick: Record<string, string> = {};
  // "Light Env" outlet Day/Night choice, keyed by "slot_n". Light Env has no
  // device direction entity (it's integration-driven off the env day-cycle), so
  // the card persists the choice server-side (card_options `oletdir_<slot>_<n>`)
  // and reads it back here on load.
  @state() private outletLightDir: Record<string, string> = {};
  // Per-outlet Time Slot working copy while editing, keyed by "slot_n".
  @state() private outletDraft: Record<string, OutletSlot[]> = {};
  // Per-outlet custom-name edits staged for Apply/Discard, keyed by "slot_n".
  @state() private outletNameDraft: Record<string, string> = {};
  // Staged config for a freshly-picked outlet mode (before its device entities
  // exist), keyed by "slot_n" -> { subfield: value }. Committed atomically via
  // sf.set_outlet_config on Apply so the mode + its settings land together.
  @state() private outletCfgDraft: Record<string, Record<string, string>> = {};
  // S-Station Device Type picker draft, keyed "slot_n" -> {type?, blower?}.
  @state() private _stDt: Record<string, { type?: string; blower?: string; light?: string }> = {};
  // Log tab: null date == "today", recomputed each render so it rolls over.
  // Leaf-VPD calibrator: 5 measured leaf-surface temps (Settings tab). Lazily
  // seeded from the live air temp the first time the section renders.
  @state() private leafSpots: number[] = [];
  @state() private leafCalTarget: "day" | "night" = "day";  // which offset the 5-reading calibrator fills
  @state() private logDate: string | null = null;
  @state() private logDev = "all";
  @state() private logType = "all";

  public setConfig(config: CardConfig): void {
    if (!config.panel) {
      throw new Error('spider-farmer-card: "panel" is required (e.g. panel: dp1)');
    }
    this.config = config;
    const dt = config.default_tab as string | undefined;
    // Tolerate the pre-3.19 names ("config" -> Environment, "cali").
    this.tab =
      dt === "environment" || dt === "config" ? "env"
      : dt === "outlets" ? "outlets"
      : dt === "outlets_log" ? "olog"
      : dt === "device_log" ? "dlog"
      : dt === "vpd" ? "vpd"
      : dt === "calibration" || dt === "cali" ? "cali"
      : dt === "alerts" ? "alerts"
      : dt === "log" ? "log"
      : "overview";
    // Out-of-range tile colouring. Precedence: server-persisted value (adopted
    // in willUpdate once hass loads) > this per-device localStorage cache >
    // optional `alarm_colors:` YAML default > off. localStorage gives an
    // instant first paint before hass/entities are available.
    const cfgDefault = (config as any).alarm_colors as ColorMode | undefined;
    let mode: ColorMode = cfgDefault === "tile" || cfgDefault === "text" ? cfgDefault : "off";
    // localStorage cache: new format is a JSON blob of all five settings; fall
    // back to the legacy plain-string mode written by older versions.
    try {
      const raw = localStorage.getItem(`sf-colors-${config.panel}`);
      if (raw === "off" || raw === "tile" || raw === "text") {
        mode = raw;
      } else if (raw) {
        const j = JSON.parse(raw);
        if (j.mode === "off" || j.mode === "tile" || j.mode === "text") mode = j.mode;
        if (j.modeIn === "off" || j.modeIn === "tile" || j.modeIn === "text") this.colorModeIn = j.modeIn;
        if (isHex6(j.hi)) this.colHi = j.hi;
        if (isHex6(j.lo)) this.colLo = j.lo;
        if (isHex6(j.in)) this.colIn = j.in;
        if (typeof j.hide2 === "boolean") this.hideLight2 = j.hide2;
        if (j.omode === "off" || j.omode === "tile" || j.omode === "text") this.outletColorMode = j.omode;
        if (isHex6(j.ocManual)) this.ocManual = j.ocManual;
        if (isHex6(j.ocSched)) this.ocSched = j.ocSched;
        if (isHex6(j.ocEnv)) this.ocEnv = j.ocEnv;
        if (isHex6(j.ocDrip)) this.ocDrip = j.ocDrip;
        if (j.dmode === "off" || j.dmode === "tile" || j.dmode === "text") this.deviceColorMode = j.dmode;
        if (isHex6(j.dcManual)) this.dcManual = j.dcManual;
        if (isHex6(j.dcSched)) this.dcSched = j.dcSched;
        if (isHex6(j.dcAuto)) this.dcAuto = j.dcAuto;
        if (isColorSource(j.source)) this.colorSource = j.source;
        if (isHex6(j.warn)) this.colWarn = j.warn;
        if (typeof j.showTrend === "boolean") this.showTrend = j.showTrend;
        if (typeof j.showBand === "boolean") this.showBand = j.showBand;
        if (typeof j.showTargets === "boolean") this.showTargets = j.showTargets;
        if (typeof j.tileSummary === "boolean") this.tileSummary = j.tileSummary;
        if (typeof j.hour12 === "boolean") this.hour12 = j.hour12;
        if (typeof j.showConn === "boolean") this.showConn = j.showConn;
        if (typeof j.connCustom === "boolean") this.connCustom = j.connCustom;
        if (typeof j.connSignal === "string") this.connSignal = j.connSignal;
        if (typeof j.showOutletsLog === "boolean") this.showOutletsLog = j.showOutletsLog;
        if (typeof j.showOutletQuick === "boolean") this.showOutletQuick = j.showOutletQuick;
        if (typeof j.outletQuickRemember === "boolean") this.outletQuickRemember = j.outletQuickRemember;
        if (typeof j.outletQuickNames === "boolean") this.outletQuickNames = j.outletQuickNames;
        if (typeof j.showVpd === "boolean") this.showVpd = j.showVpd;
        if (typeof j.showLeafVpd === "boolean") this.showLeafVpd = j.showLeafVpd;
        if (typeof j.vpdLeaf === "boolean") this.vpdLeaf = j.vpdLeaf;
        if (typeof j.showDeviceLog === "boolean") this.showDeviceLog = j.showDeviceLog;
        if (typeof j.showDeviceQuick === "boolean") this.showDeviceQuick = j.showDeviceQuick;
        if (typeof j.deviceQuickRemember === "boolean") this.deviceQuickRemember = j.deviceQuickRemember;
        if (typeof j.customNames === "boolean") this.customOutletNames = j.customNames;
        if (j.outletNames && typeof j.outletNames === "object") this.outletNames = j.outletNames;
        if (typeof j.customLayout === "boolean") this.customLayout = j.customLayout;
        if (typeof j.scale === "number" && j.scale >= 70 && j.scale <= 150) this.cardScale = j.scale;
        if (typeof j.cols === "number" && j.cols >= 2 && j.cols <= 5) this.tileCols = j.cols;
      }
    } catch { /* storage blocked / bad JSON — use defaults */ }
    this.colorMode = mode;
    this._colorSynced = false;   // re-sync from the server for this panel
  }

  // The colour settings persisted server-side for this panel (via
  // sf.set_card_option, read from the Alarm Settings sensor's card_options).
  private serverColors(): {
    mode?: ColorMode; modeIn?: ColorMode; hi?: string; lo?: string; in?: string;
    source?: ColorSource; warn?: string;
    showTrend?: boolean; showBand?: boolean; showTargets?: boolean;
    tileSummary?: boolean; hour12?: boolean;
    hide2?: boolean; omode?: ColorMode; customNames?: boolean;
    customLayout?: boolean; scale?: number; cols?: number;
    layoutMode?: "sections" | "unified";
    unifiedDeviceQuick?: boolean; unifiedOutletQuick?: boolean;
    tileOrder?: { params: string[]; devices: string[]; outlets: string[]; all: string[] };
    ocManual?: string; ocSched?: string; ocEnv?: string; ocDrip?: string;
    dmode?: ColorMode; dcManual?: string; dcSched?: string; dcAuto?: string;
    showConn?: boolean; connCustom?: boolean; connSignal?: string;
    showOutletsLog?: boolean; showOutletQuick?: boolean; outletQuickRemember?: boolean; outletQuickNames?: boolean;
    showVpd?: boolean; vpdLeaf?: boolean; showLeafVpd?: boolean;
    showDeviceLog?: boolean; showDeviceQuick?: boolean; deviceQuickRemember?: boolean;
    graphRange?: number;
    ologRange?: number;
    powerMetric?: string;
    hiddenTiles?: Record<string, boolean>;
    tileRadius?: number; tileBorderW?: number; tileBorderCol?: string; tileBg?: string;
    taTiles?: boolean; taDevices?: boolean; taOutlets?: boolean;
    cooldownShow?: boolean; cooldownDevice?: boolean; cooldownOutlet?: boolean; cooldownSecs?: number;
    outletsOnOverview?: boolean; outletQuickOverview?: boolean; hideEnergyTile?: boolean;
    tempSource?: string; extTemp?: string; extHumi?: string;
    smart?: Record<string, any>;
  } {
    const co = this.get(`sensor.sf_${this.config.panel}_alarm_settings`)
      ?.attributes.card_options as Record<string, string> | undefined;
    if (!co) return {};
    const ok = (v: string): v is ColorMode => v === "off" || v === "tile" || v === "text";
    const out: any = {};
    if (co.colors && ok(co.colors)) out.mode = co.colors;
    if (co.colors_in && ok(co.colors_in)) out.modeIn = co.colors_in;
    if (isColorSource(co.color_source)) out.source = co.color_source;
    if (isHex6(co.color_warn)) out.warn = co.color_warn;
    if (co.show_conn === "1" || co.show_conn === "0") out.showConn = co.show_conn === "1";
    if (co.conn_custom === "1" || co.conn_custom === "0") out.connCustom = co.conn_custom === "1";
    if (typeof co.conn_signal === "string") out.connSignal = co.conn_signal;
    if (co.outlets_log === "1" || co.outlets_log === "0") out.showOutletsLog = co.outlets_log === "1";
    if (co.outlet_quick === "1" || co.outlet_quick === "0") out.showOutletQuick = co.outlet_quick === "1";
    if (co.outlet_quick_remember === "1" || co.outlet_quick_remember === "0") out.outletQuickRemember = co.outlet_quick_remember === "1";
    if (co.outlet_quick_names === "1" || co.outlet_quick_names === "0") out.outletQuickNames = co.outlet_quick_names === "1";
    if (co.vpd_graph === "1" || co.vpd_graph === "0") out.showVpd = co.vpd_graph === "1";
    if (co.vpd_leaf === "1" || co.vpd_leaf === "0") out.vpdLeaf = co.vpd_leaf === "1";
    if (co.leaf_vpd_tile === "1" || co.leaf_vpd_tile === "0") out.showLeafVpd = co.leaf_vpd_tile === "1";
    if (co.device_log === "1" || co.device_log === "0") out.showDeviceLog = co.device_log === "1";
    if (co.device_quick === "1" || co.device_quick === "0") out.showDeviceQuick = co.device_quick === "1";
    if (co.device_quick_remember === "1" || co.device_quick_remember === "0") out.deviceQuickRemember = co.device_quick_remember === "1";
    if (co.graph_range) out.graphRange = Number(co.graph_range) || 6;
    if (co.olog_range) out.ologRange = Number(co.olog_range) || 24;
    if (co.power_metric) out.powerMetric = co.power_metric;
    if (co.hidden_tiles !== undefined) {
      const h: Record<string, boolean> = {};
      for (const id of co.hidden_tiles.split(",").filter(Boolean)) h[id] = true;
      out.hiddenTiles = h;
    }
    if (co.tile_radius !== undefined && co.tile_radius !== "") out.tileRadius = Number(co.tile_radius);
    if (co.tile_border_w !== undefined && co.tile_border_w !== "") out.tileBorderW = Number(co.tile_border_w);
    if (isHex6(co.tile_border_col)) out.tileBorderCol = co.tile_border_col;
    else if (co.tile_border_col === "") out.tileBorderCol = "";
    if (isHex6(co.tile_bg)) out.tileBg = co.tile_bg;
    else if (co.tile_bg === "") out.tileBg = "";
    if (co.ta_tiles === "1" || co.ta_tiles === "0") out.taTiles = co.ta_tiles === "1";
    if (co.ta_devices === "1" || co.ta_devices === "0") out.taDevices = co.ta_devices === "1";
    if (co.ta_outlets === "1" || co.ta_outlets === "0") out.taOutlets = co.ta_outlets === "1";
    if (co.cooldown_show === "1" || co.cooldown_show === "0") out.cooldownShow = co.cooldown_show === "1";
    if (co.cooldown_device === "1" || co.cooldown_device === "0") out.cooldownDevice = co.cooldown_device === "1";
    if (co.cooldown_outlet === "1" || co.cooldown_outlet === "0") out.cooldownOutlet = co.cooldown_outlet === "1";
    if (co.cooldown_secs !== undefined && co.cooldown_secs !== "") out.cooldownSecs = Number(co.cooldown_secs);
    if (co.overview_outlets === "1" || co.overview_outlets === "0") out.outletsOnOverview = co.overview_outlets === "1";
    if (co.overview_quick === "1" || co.overview_quick === "0") out.outletQuickOverview = co.overview_quick === "1";
    if (co.hide_energy_tile === "1" || co.hide_energy_tile === "0") out.hideEnergyTile = co.hide_energy_tile === "1";
    if (co.temp_source === "sf" || co.temp_source === "external") out.tempSource = co.temp_source;
    if (typeof co.ext_temp === "string") out.extTemp = co.ext_temp;
    if (typeof co.ext_humi === "string") out.extHumi = co.ext_humi;
    if (typeof co.smart === "string") {
      try { out.smart = JSON.parse(co.smart); } catch { /* ignore */ }
    }
    if (co.show_trend === "1" || co.show_trend === "0") out.showTrend = co.show_trend === "1";
    if (co.show_band === "1" || co.show_band === "0") out.showBand = co.show_band === "1";
    if (co.show_targets === "1" || co.show_targets === "0") out.showTargets = co.show_targets === "1";
    if (co.tile_summary === "1" || co.tile_summary === "0") out.tileSummary = co.tile_summary === "1";
    if (co.time_12h === "1" || co.time_12h === "0") out.hour12 = co.time_12h === "1";
    if (isHex6(co.color_hi)) out.hi = co.color_hi;
    if (isHex6(co.color_lo)) out.lo = co.color_lo;
    if (isHex6(co.color_in)) out.in = co.color_in;
    if (co.hide_light2 === "1" || co.hide_light2 === "0") out.hide2 = co.hide_light2 === "1";
    if (co.custom_outlet_names === "1" || co.custom_outlet_names === "0")
      out.customNames = co.custom_outlet_names === "1";
    if (co.custom_layout === "1" || co.custom_layout === "0")
      out.customLayout = co.custom_layout === "1";
    const sc = parseInt(co.card_scale, 10);
    if (Number.isFinite(sc) && sc >= 70 && sc <= 150) out.scale = sc;
    const cc = parseInt(co.tile_cols, 10);
    if (Number.isFinite(cc) && cc >= 2 && cc <= 5) out.cols = cc;
    // Phase 2: layout mode + per-section tile order.
    if (co.layout_mode === "sections" || co.layout_mode === "unified")
      out.layoutMode = co.layout_mode;
    if (co.unified_dev_quick === "1" || co.unified_dev_quick === "0")
      out.unifiedDeviceQuick = co.unified_dev_quick === "1";
    if (co.unified_outlet_quick === "1" || co.unified_outlet_quick === "0")
      out.unifiedOutletQuick = co.unified_outlet_quick === "1";
    if (co.tile_order) {
      try {
        const t = JSON.parse(co.tile_order);
        if (t && typeof t === "object") {
          const arr = (v: any): string[] => Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
          out.tileOrder = { params: arr(t.params), devices: arr(t.devices), outlets: arr(t.outlets), all: arr(t.all) };
        }
      } catch { /* bad JSON — ignore, use default order */ }
    }
    if (co.outlet_colors && ok(co.outlet_colors)) out.omode = co.outlet_colors;
    if (isHex6(co.oc_manual)) out.ocManual = co.oc_manual;
    if (isHex6(co.oc_sched)) out.ocSched = co.oc_sched;
    if (isHex6(co.oc_env)) out.ocEnv = co.oc_env;
    if (isHex6(co.oc_drip)) out.ocDrip = co.oc_drip;
    if (co.device_colors && ok(co.device_colors)) out.dmode = co.device_colors;
    if (isHex6(co.dc_manual)) out.dcManual = co.dc_manual;
    if (isHex6(co.dc_sched)) out.dcSched = co.dc_sched;
    if (isHex6(co.dc_auto)) out.dcAuto = co.dc_auto;
    return out;
  }

  // Per-outlet custom names persisted server-side: card_options keys of the form
  // `outlet_name_<slot>_<n>` -> name. Returns a `${slot}_${n}` -> name map.
  private serverOutletNames(): Record<string, string> {
    const co = this.get(`sensor.sf_${this.config.panel}_alarm_settings`)
      ?.attributes.card_options as Record<string, string> | undefined;
    const out: Record<string, string> = {};
    if (!co) return out;
    for (const [k, v] of Object.entries(co)) {
      if (k.startsWith("outlet_name_") && typeof v === "string")
        out[k.slice("outlet_name_".length)] = v;
    }
    return out;
  }
  // "Light Env" Day/Night choices persisted per outlet (card_options
  // `oletdir_<slot>_<n>`), read back so the tile shows the direction after a
  // reload without waiting on any entity.
  private serverOutletLightDirs(): Record<string, string> {
    const co = this.get(`sensor.sf_${this.config.panel}_alarm_settings`)
      ?.attributes.card_options as Record<string, string> | undefined;
    const out: Record<string, string> = {};
    if (!co) return out;
    for (const [k, v] of Object.entries(co)) {
      if (k.startsWith("oletdir_") && (v === "Day" || v === "Night"))
        out[k.slice("oletdir_".length)] = v;
    }
    return out;
  }

  // ── Header connection info ──────────────────────────────────────────────
  // Resolve online + signal for the header badge. Signal comes from the
  // controller's Wi-Fi rssi (exposed as a wifi_rssi attribute on the panel's
  // alarm_settings sensor) unless a custom signal entity is chosen — e.g. the
  // controller is on a different AP or hard-wired and its dBm is reported by a
  // router/AP integration. Colour thresholds: green ≥ -67, yellow -67…-75,
  // red < -75; bar count grows with strength.
  private connInfo(): { online: boolean; rssi: number | null; bars: number; color: string; wired: boolean } {
    let rssi: number | null = null;
    let online = false;
    let wired = false;
    if (this.connCustom && this.connSignal) {
      const e = this.get(this.connSignal);
      if (e) {
        const v = Number(e.state);
        if (Number.isFinite(v)) rssi = v;
        online = e.state !== "unavailable" && e.state !== "unknown" && e.state !== "off";
      }
    } else {
      const a = this.get(`sensor.sf_${this.config.panel}_alarm_settings`);
      if (a) {
        wired = a.attributes.eth_online === true;
        const r = a.attributes.wifi_rssi;
        if (typeof r === "number") rssi = r;
        const o = a.attributes.wifi_online;
        online = wired || (typeof o === "boolean" ? o
          : (a.state !== "unavailable" && a.state !== "unknown"));
      }
    }
    let bars = 0, color = "var(--secondary-text-color)";
    if (rssi != null) {
      if (rssi >= -60) { bars = 4; color = "#54c06a"; }
      else if (rssi >= -67) { bars = 3; color = "#54c06a"; }
      else if (rssi >= -75) { bars = 2; color = "#e0b23a"; }
      else { bars = 1; color = "#e2544f"; }
    }
    return { online, rssi, bars, color, wired };
  }

  private renderConn() {
    if (!this.showConn) return nothing;
    const c = this.connInfo();
    const stColor = c.online ? "#54c06a" : "#e2544f";
    const st = html`<span class="conn-st" style="color:${stColor}">
        <span class="conn-dot" style="background:${stColor}"></span>${c.online ? "Online" : "Offline"}
      </span>`;
    // Hard-wired: show an Ethernet icon instead of Wi-Fi bars.
    if (c.wired) {
      return html`<span class="conn">${st}
        <ha-icon class="conn-eth" icon="mdi:ethernet"
          style="color:${stColor}" title="Wired (Ethernet)"></ha-icon>
      </span>`;
    }
    const off = "var(--divider-color, #3a3e44)";
    const bars = [1, 2, 3, 4].map((i) => {
      const h = 3 + i * 2;   // 5,7,9,11
      return svg`<rect x=${(i - 1) * 4} y=${12 - h} width="3" height=${h} rx="1"
        fill=${i <= c.bars ? c.color : off}></rect>`;
    });
    return html`<span class="conn">${st}
      <svg width="15" height="12" viewBox="0 0 15 12" aria-label="signal">${bars}</svg>
    </span>`;
  }

  // Candidate custom signal entities: anything with a signal_strength device
  // class (router/AP RSSI sensors), so the picker isn't cluttered with unrelated
  // sensors.
  private signalEntityOptions(): { id: string; name: string }[] {
    if (!this.hass) return [];
    return Object.keys(this.hass.states)
      .filter((id) => id.startsWith("sensor.")
        && this.hass!.states[id].attributes.device_class === "signal_strength")
      .sort()
      .map((id) => ({ id, name: this.hass!.states[id].attributes.friendly_name || id }));
  }

  // Persist one card option server-side (survives upgrades, syncs across devices).
  private persistColorOption(key: string, value: string): void {
    const eid = `sensor.sf_${this.config.panel}_alarm_settings`;
    if (this.get(eid)) {
      this.hass?.callService("sf", "set_card_option", { entity_id: eid, key, value });
    }
  }
  // Mirror the current display settings into the localStorage cache (instant paint).
  private cacheColors(): void {
    try {
      localStorage.setItem(`sf-colors-${this.config.panel}`, JSON.stringify({
        mode: this.colorMode, modeIn: this.colorModeIn, source: this.colorSource,
        warn: this.colWarn, showTrend: this.showTrend, showBand: this.showBand,
        showTargets: this.showTargets,
        tileSummary: this.tileSummary,
        hour12: this.hour12,
        showConn: this.showConn, connCustom: this.connCustom, connSignal: this.connSignal,
        showOutletsLog: this.showOutletsLog,
        showOutletQuick: this.showOutletQuick, outletQuickRemember: this.outletQuickRemember,
        outletQuickNames: this.outletQuickNames,
        showVpd: this.showVpd, vpdLeaf: this.vpdLeaf, showLeafVpd: this.showLeafVpd,
        showDeviceLog: this.showDeviceLog, showDeviceQuick: this.showDeviceQuick,
        deviceQuickRemember: this.deviceQuickRemember,
        hi: this.colHi, lo: this.colLo, in: this.colIn, hide2: this.hideLight2,
        omode: this.outletColorMode, ocManual: this.ocManual, ocSched: this.ocSched,
        ocEnv: this.ocEnv, ocDrip: this.ocDrip,
        dmode: this.deviceColorMode, dcManual: this.dcManual, dcSched: this.dcSched,
        dcAuto: this.dcAuto,
        customNames: this.customOutletNames, outletNames: this.outletNames,
        customLayout: this.customLayout, scale: this.cardScale, cols: this.tileCols,
      }));
    } catch { /* ignore */ }
  }
  // Inline style for the card root when Custom layout is on: an overall zoom plus
  // the tiles-per-row CSS var the grids read. Empty when the feature is off, so
  // the card renders exactly as before.
  private layoutStyle(): string {
    const parts: string[] = [];
    if (this.customLayout) {
      parts.push(`--sf-cols:${this.tileCols}`);
      if (this.cardScale !== 100) parts.push(`zoom:${(this.cardScale / 100).toFixed(2)}`);
    }
    // Tile appearance (applies regardless of custom layout). Only emit non-defaults.
    if (this.tileRadius !== 12) parts.push(`--sf-tile-radius:${this.tileRadius}px`);
    if (this.tileBorderW > 0) parts.push(`--sf-tile-bw:${this.tileBorderW}px`);
    if (this.tileBorderCol) parts.push(`--sf-tile-bc:${this.tileBorderCol}`);
    if (this.tileBg) parts.push(`--sf-tile-bg:${this.tileBg}`);
    return parts.join(";");
  }

  // ── Phase 2 — movable tiles ────────────────────────────────────────
  // Reorder `items` by a saved list of stable ids: saved-and-present first in
  // saved order, then any present-but-unseen items appended in their default
  // order. Absent saved ids are naturally skipped (only present items sort).
  // Empty/absent order → items unchanged (today's behaviour). Handles the
  // dynamic-tile case: a newly-attached probe/VPD/PPFD gracefully appends.
  private applyOrder<T>(items: T[], idOf: (t: T) => string, order: string[]): T[] {
    if (!order || order.length === 0) return items;
    const pos = new Map<string, number>();
    order.forEach((id, i) => pos.set(id, i));
    const seen = items.filter((it) => pos.has(idOf(it)))
      .sort((a, b) => (pos.get(idOf(a))! - pos.get(idOf(b))!));
    const rest = items.filter((it) => !pos.has(idOf(it)));
    return [...seen, ...rest];
  }

  // Persist one section's tile order (Mode A) or the unified order (Mode B).
  private persistTileOrder(): void {
    this.persistColorOption("tile_order", JSON.stringify(this.tileOrder));
  }

  // The Overview tiles as {id, tpl} lists in DEFAULT (natural) order, before any
  // saved order. Outlets are always built here (unified mode shows them; sections
  // mode gates them on outletsOnOverview at render time). energy = the Power tile
  // or null. Each tile keeps a stable id so ordering survives tiles coming/going.
  private overviewNatural(): { params: TileItem[]; devices: TileItem[]; outlets: TileItem[]; energy: TileItem | null } {
    const nz = (v: unknown) => (v !== nothing ? v : undefined);
    const params: TileItem[] = [];
    for (const p of PARAMS) {
      const tpl = this.renderParam(p);
      if (tpl !== nothing) params.push({ id: p[0], tpl, pop: this.paramPop(p[0]) });
    }
    const soil = this.soilStatsTile();
    if (soil !== nothing) params.push({ id: "soil_stats", tpl: soil, pop: nz(this.renderSoilAllTable()) });
    const devices: TileItem[] = this.overviewDevices().map((d) => {
      const key = `${d.domain}:${d.suffix}`;
      return { id: key, tpl: this.deviceTile(d), pop: this.devicePop(d, key) };
    });
    const outlets: TileItem[] = this.outletSlots().flatMap((sl) => this.outletNums(sl).map((n) => {
      const okey = this.outletKey(sl, n);
      return { id: `${sl}:${n}`, tpl: this.outletTile(sl, n), pop: this.outletOpen === okey ? nz(this.renderOutletPop()) : undefined };
    }));
    const energy: TileItem | null = this.hasEnergyTile()
      ? { id: "energy", tpl: this.energyTile(), pop: this.paramOpen === "power" ? nz(this.renderParamGraph()) : undefined }
      : null;
    return { params, devices, outlets, energy };
  }

  // The expansion under a param tile: its graph when open, and for a soil-average
  // tile its per-probe breakdown when that's open (either or both).
  private paramPop(suffix: string): unknown {
    const parts: unknown[] = [];
    if (this.paramOpen === suffix) { const g = this.renderParamGraph(); if (g !== nothing) parts.push(g); }
    if (suffix.startsWith("soil_avg_")) {
      const metric = suffix.slice("soil_avg_".length) as "temperature" | "moisture" | "ec";
      if (this.soilGraphOpen === metric) parts.push(this.renderSoilGraph(metric));
      if (this.soilOpen === metric) {
        const sp = this.renderSoilPop(); if (sp !== nothing) parts.push(sp);
      }
    }
    return parts.length ? html`${parts}` : undefined;
  }

  // The expansion under a device tile: its level graph when the chart icon is open,
  // and its controls when the tile body is open (either or both). (v0.21.75)
  private devicePop(d: { domain: string; suffix: string; id: string; label: string; icon: string }, key: string): unknown {
    const parts: unknown[] = [];
    if (this.deviceGraphOpen === key) { const g = this.renderDeviceGraph(d); if (g !== nothing) parts.push(g); }
    if (this.deviceOpen === key) { const c = this.renderDevicePop(); if (c !== nothing) parts.push(c); }
    return parts.length ? html`${parts}` : undefined;
  }

  // Unified-mode merged natural order. Quick rows (slice 3.5) default to the TOP —
  // device quick row first, then outlet quick row(s) — followed by sensors, energy,
  // devices, outlets. They're full-width movable bars, included only when their
  // toggle is on and they have content. (Default-top per John, 2026-09-23.)
  private unifiedNatural(nat: { params: TileItem[]; devices: TileItem[]; outlets: TileItem[]; energy: TileItem | null }): TileItem[] {
    const items: TileItem[] = [];
    if (this.unifiedDeviceQuick) {
      const q = this.renderDeviceQuickRow(true);
      if (q !== nothing) items.push({ id: "quickrow:devices", tpl: q, full: true });
    }
    if (this.unifiedOutletQuick) {
      for (const slot of this.outletSlots()) {
        const q = this.renderQuickRow(slot, true);
        if (q !== nothing) items.push({ id: `quickrow:${slot}`, tpl: q, full: true });
      }
    }
    items.push(...nat.params, ...(nat.energy ? [nat.energy] : []), ...nat.devices, ...nat.outlets);
    return items;
  }

  // Apply the saved unified order, but any quick row NOT yet in the saved order
  // (e.g. just toggled on) is pinned to the TOP in natural order rather than
  // appended at the end — so newly-enabled quick rows default to the top. Once a
  // quick row is part of the saved order (after an Apply/drag), it follows it.
  private unifiedOrder(items: TileItem[], savedAll: string[]): TileItem[] {
    const saved = new Set(savedAll);
    const isUnseenFull = (t: TileItem) => !!t.full && !saved.has(t.id);
    const pinned = items.filter(isUnseenFull);
    const rest = items.filter((t) => !isUnseenFull(t));
    return [...pinned, ...this.applyOrder(rest, (t) => t.id, savedAll)];
  }

  // Present tile-ids per section AND the merged unified list, in natural order.
  // Used to seed rearrange and Reset.
  private presentTileIds(): { params: string[]; devices: string[]; outlets: string[]; all: string[] } {
    const n = this.overviewNatural();
    const ids = (a: TileItem[]) => a.map((t) => t.id);
    return { params: ids(n.params), devices: ids(n.devices), outlets: ids(n.outlets), all: ids(this.unifiedNatural(n)) };
  }

  // Enter rearrange mode: seed the draft AND the baseline from the current
  // displayed order (natural order with the saved order applied), then jump to
  // Overview so the tiles are visible.
  private enterReorder(): void {
    // Reorder only applies to cards with an Overview tab (not outlet-only strips).
    if (this.outletOnly()) return;
    const nat = this.presentTileIds();
    const eff = {
      params: this.applyOrder(nat.params, (x) => x, this.tileOrder.params),
      devices: this.applyOrder(nat.devices, (x) => x, this.tileOrder.devices),
      outlets: this.applyOrder(nat.outlets, (x) => x, this.tileOrder.outlets),
      // Unified "all" seeds from the same pinned ordering the panel renders, so a
      // just-enabled quick row starts at the top in Rearrange too.
      all: this.unifiedOrder(this.unifiedNatural(this.overviewNatural()), this.tileOrder.all).map((t) => t.id),
    };
    this.tileOrderDraft = { ...eff };
    this.tileOrderBase = { ...eff };
    this.hiddenDraft = { ...this.hiddenTiles };   // working copy of hidden set
    this.reorderMode = true;
    this.tab = "overview";
  }

  private exitReorder(apply: boolean): void {
    if (apply && this.tileOrderDraft) {
      this.tileOrder = { ...this.tileOrderDraft };
      this.persistTileOrder();
    }
    if (apply && this.hiddenDraft) {
      this.hiddenTiles = { ...this.hiddenDraft };
      this.persistHidden();
    }
    this.reorderMode = false;
    this.tileOrderDraft = null;
    this.tileOrderBase = null;
    this.hiddenDraft = null;
    this.dragId = null;
    this.dragSec = "";
  }
  // The committed hidden set as a comma-list, saved server-side like the order.
  private persistHidden(): void {
    this.persistColorOption("hidden_tiles",
      Object.keys(this.hiddenTiles).filter((k) => this.hiddenTiles[k]).join(","));
  }
  // The hidden set in effect right now: the draft while rearranging, else saved.
  private effHidden(): Record<string, boolean> {
    return this.reorderMode && this.hiddenDraft ? this.hiddenDraft : this.hiddenTiles;
  }
  private isHidden(id: string): boolean { return !!this.effHidden()[id]; }
  // Toggle a tile's hidden state (only meaningful in Rearrange mode).
  private toggleHide(id: string): void {
    if (!this.reorderMode) return;
    const d = { ...(this.hiddenDraft ?? {}) };
    if (d[id]) delete d[id]; else d[id] = true;
    this.hiddenDraft = d;
  }
  // The eye toggle shown on each tile (and tray tile) in Rearrange mode.
  private hideBtn(id: string, hidden: boolean) {
    return html`<button class="rhide" title=${hidden ? "Show tile" : "Hide tile"}
      aria-label=${hidden ? "Show tile" : "Hide tile"}
      @pointerdown=${(e: Event) => e.stopPropagation()}
      @click=${(e: Event) => { e.stopPropagation(); this.toggleHide(id); }}>
      <ha-icon icon=${hidden ? "mdi:eye-off-outline" : "mdi:eye-outline"}></ha-icon>
    </button>`;
  }

  // Reset order back to the card's default (natural order). Leaves the draft
  // dirty vs the baseline if the saved order was non-default, so Apply persists it.
  private resetOrder(): void {
    const nat = this.presentTileIds();
    this.tileOrderDraft = { params: nat.params, devices: nat.devices, outlets: nat.outlets, all: nat.all };
  }

  // Whether the draft differs from the baseline captured on entry (drives Apply).
  private reorderDirty(): boolean {
    if (!this.tileOrderDraft || !this.tileOrderBase) return false;
    const norm = (a: string[]) => a.join("\u0001");
    const orderDirty = (["params", "devices", "outlets", "all"] as const)
      .some((s) => norm(this.tileOrderDraft![s]) !== norm(this.tileOrderBase![s]));
    const hidNorm = (m: Record<string, boolean>) =>
      Object.keys(m).filter((k) => m[k]).sort().join("\u0001");
    const hideDirty = hidNorm(this.hiddenDraft ?? {}) !== hidNorm(this.hiddenTiles);
    return orderDirty || hideDirty;
  }

  // Move dragId to sit where targetId is, within one section's draft list.
  private reorderMove(sec: "params" | "devices" | "outlets" | "all", dragId: string, targetId: string): void {
    if (!this.tileOrderDraft || dragId === targetId) return;
    const arr = [...this.tileOrderDraft[sec]];
    const from = arr.indexOf(dragId), to = arr.indexOf(targetId);
    if (from < 0 || to < 0) return;
    arr.splice(from, 1);
    arr.splice(to, 0, dragId);
    this.tileOrderDraft = { ...this.tileOrderDraft, [sec]: arr };
  }

  // ── Pointer-drag handlers (mouse + touch, no native HTML5 DnD) ────────────
  private onReorderDown(e: PointerEvent): void {
    const wrap = (e.target as HTMLElement)?.closest?.(".rwrap") as HTMLElement | null;
    if (!wrap) return;
    this.dragId = wrap.dataset.tid || null;
    this.dragSec = wrap.dataset.sec || "";
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* ok */ }
    e.preventDefault();
  }
  private onReorderMoveEvt(e: PointerEvent): void {
    if (!this.dragId) return;
    e.preventDefault();
    const root = this.renderRoot as unknown as { elementFromPoint?: (x: number, y: number) => Element | null };
    const el = root.elementFromPoint?.(e.clientX, e.clientY) as HTMLElement | null;
    const over = el?.closest?.(".rwrap") as HTMLElement | null;
    if (!over) return;
    const sec = over.dataset.sec || "", tid = over.dataset.tid || "";
    if (sec !== this.dragSec || !tid || tid === this.dragId) return;
    this.reorderMove(sec as "params" | "devices" | "outlets" | "all", this.dragId, tid);
  }
  private onReorderUp(): void { this.dragId = null; }

  // "above" (over max) / "below" (under min) / null for an Overview metric,
  // used by the tile colouring. Only fires for a metric whose alarm is enabled.
  // Is a value outside an alarm metric's enabled range? (raw compare; callers
  // gate on colorMode). alarmKey is the alarm_settings key (temp, humi, vpd,
  // co2, ppfd, tempSoil, humiSoil, ECSoil).
  private outOfRange(alarmKey: string, value: number): "above" | "below" | null {
    const s = this.alertsSettings();
    if (!s || !Number.isFinite(value)) return null;
    const m = [...(s.climate || []), ...(s.substrate || [])]
      .find((x: any) => x && x.key === alarmKey);
    if (!m || !m.enabled) return null;
    const max = Number(m.max), min = Number(m.min);
    if (Number.isFinite(max) && value > max) return "above";
    if (Number.isFinite(min) && value < min) return "below";
    return null;
  }

  // Resolve the highlight for one reading: which mode applies and the colour to
  // use. Above/below its enabled alarm limits -> out-of-range mode + hi/lo
  // colour; otherwise (within limits, or no alarm set) -> in-range mode + colour
  // (in-range colours every reading). Returns null when the applicable mode is
  // "off" or the value isn't a number.
  // Map an out-of-range verdict to the highlight to apply, honouring the user's
  // colour-mode choices (out-of-range hi/lo colour, else in-range colour).
  private colorForOor(
    oor: "above" | "below" | "near" | null
  ): { mode: ColorMode; color: string; state: "above" | "below" | "near" | "in" } | null {
    if (oor === "above")
      return this.colorMode === "off" ? null
        : { mode: this.colorMode, color: this.colHi, state: "above" };
    if (oor === "below")
      return this.colorMode === "off" ? null
        : { mode: this.colorMode, color: this.colLo, state: "below" };
    if (oor === "near")   // inside the ± dead-zone margin — a warning, uses the OOR mode
      return this.colorMode === "off" ? null
        : { mode: this.colorMode, color: this.colWarn, state: "near" };
    return this.colorModeIn === "off" ? null
      : { mode: this.colorModeIn, color: this.colIn, state: "in" };
  }
  private readingColor(
    alarmKey: string | undefined, valueStr: string
  ): { mode: ColorMode; color: string; state: "above" | "below" | "near" | "in" } | null {
    const v = parseFloat(valueStr);
    if (!Number.isFinite(v)) return null;
    return this.colorForOor(alarmKey ? this.outOfRange(alarmKey, v) : null);
  }

  // Leaf VPD target bounds (kPa) from the local min/max number entities, and the
  // out-of-range verdict for a leaf-VPD reading against them. Unlike the air
  // metrics these aren't a device alarm — they're user targets set in the
  // Environment tab — so they get their own comparison.
  private leafVpdRange(): { min: number | null; max: number | null } {
    const mn = this.get(this.eid("number", "leaf_vpd_min"));
    const mx = this.get(this.eid("number", "leaf_vpd_max"));
    const num = (e?: HassEntity) =>
      e && Number.isFinite(+e.state) ? +e.state : null;
    return { min: num(mn), max: num(mx) };
  }

  // The active (day or night) environment target + dead zone for a metric, or
  // null when the metric has no target or the env entities aren't present. The
  // active period follows the controller's day-cycle window via cycleIsDay()
  // (daytime_schedule sensor, or the day-cycle start/stop times) — the same
  // source the header badge uses, so tiles and badge never disagree.
  // The plan stage currently driving the controller (matched by the running
  // stageId from getDevSta), or null when no plan is active.
  private planStageCurrent(): any | null {
    const plan = this.planInfo();
    if (!plan.active || !plan.stages.length) return null;
    const id = plan.progress ? plan.progress.stageId : undefined;
    return plan.stages.find((s: any) => s.stageId === id) || plan.stages[0];
  }

  // PPFD-target subline for the Current PPFD tile: only while a plan is active
  // and a light is running in PPFD mode, show that light's PPFD setpoint (which
  // the plan drives) beneath the live reading. (v0.21.25)
  private ppfdPlanTargetSub() {
    let active = false;
    try { active = !!this.planInfo().active; } catch { active = false; }
    if (!active) return nothing;
    const p = this.config.panel;
    for (const s of ["light_1", "light_2"]) {
      const lm = this.modeOf(`select.sf_${p}_${s}_mode`, "");
      if (lm !== "PPFD" && lm !== "PPFD - Plan") continue;
      const tgt = Number(this.get(`number.sf_${p}_${s}_ppfd_target`)?.state);
      if (Number.isFinite(tgt) && tgt > 0) {
        return html`<div class="tile-target">target ${Math.round(tgt)} µmol</div>`;
      }
    }
    return nothing;
  }

  private targetInfo(suffix: string): { target: number; dead: number } | null {
    const metric = PARAM_ENV_TARGET[suffix];
    if (!metric) return null;
    const p = this.config.panel;
    const isDay = this.cycleIsDay() !== false;
    // While a plan is running the controller drives targets from the current
    // plan stage — the Overview tiles must reflect that, not the manual (paused)
    // configFile targets. Stage temps are °C; convert to the tile's display unit.
    const cur = this.planStageCurrent();
    if (cur) {
      const raw = cur[`${metric}_${isDay ? "day" : "night"}`];
      if (raw != null && Number.isFinite(Number(raw))) {
        let target = Number(raw);
        let dead = Number(cur[`${metric}_dz`]);
        if (metric === "temp") {
          const u = this.get(`number.sf_${p}_env_temp_day`)?.attributes?.unit_of_measurement;
          if (u === "°F" || u === "℉") {
            target = target * 9 / 5 + 32;
            if (Number.isFinite(dead)) dead = dead * 9 / 5;
          }
        }
        if (!Number.isFinite(dead))
          dead = Number(this.get(`number.sf_${p}_env_${metric}_deadband`)?.state ?? 0) || 0;
        return { target: Math.round(target * 10) / 10, dead: Math.round(dead * 10) / 10 };
      }
    }
    const tE = this.get(`number.sf_${p}_env_${metric}_${isDay ? "day" : "night"}`);
    const dE = this.get(`number.sf_${p}_env_${metric}_deadband`);
    if (!tE || !dE) return null;
    const target = parseFloat(tE.state), dead = parseFloat(dE.state);
    if (!Number.isFinite(target) || !Number.isFinite(dead)) return null;
    return { target, dead };
  }
  // Numeric VPD range (kPa) implied by a temp/humidity setpoint + dead zones.
  private vpdRangeNums(tempId: string, humiId: string): { lo: number; hi: number } | null {
    const te = this.get(tempId), he = this.get(humiId);
    if (!te || !he) return null;
    const t = Number(te.state), h = Number(he.state);
    if (!Number.isFinite(t) || !Number.isFinite(h)) return null;
    const p = this.config.panel;
    const tDz = Number(this.get(`number.sf_${p}_env_temp_deadband`)?.state ?? 0) || 0;
    const hDz = Number(this.get(`number.sf_${p}_env_humi_deadband`)?.state ?? 0) || 0;
    const isC = te.attributes.unit_of_measurement === "°C";
    const toC = (v: number) => (isC ? v : (v - 32) * 5 / 9);
    const svp = (tc: number) => 0.6108 * Math.exp((17.27 * tc) / (tc + 237.3));
    const lo = Math.max(0, svp(toC(t - tDz)) * (1 - Math.min(100, h + hDz) / 100));
    const hi = Math.max(0, svp(toC(t + tDz)) * (1 - Math.max(0, h - hDz) / 100));
    return { lo, hi };
  }
  // Air VPD's implied healthy range from the active day/night temp+humi targets.
  // Plan-aware: uses targetInfo (which follows the current plan stage when a plan
  // runs), so the VPD band tracks the plan targets like the other tiles.
  private airVpdRange(): { lo: number; hi: number } | null {
    const p = this.config.panel;
    const t = this.targetInfo("temperature");
    const h = this.targetInfo("humidity");
    if (!t || !h) {
      const isDay = this.cycleIsDay() !== false;
      const s = isDay ? "day" : "night";
      return this.vpdRangeNums(`number.sf_${p}_env_temp_${s}`, `number.sf_${p}_env_humi_${s}`);
    }
    const u = this.get(`number.sf_${p}_env_temp_day`)?.attributes?.unit_of_measurement;
    const isC = u === "°C";
    const toC = (v: number) => (isC ? v : (v - 32) * 5 / 9);
    const svp = (tc: number) => 0.6108 * Math.exp((17.27 * tc) / (tc + 237.3));
    const tC = toC(t.target);
    const tdC = isC ? t.dead : (t.dead * 5) / 9;
    const hLo = Math.max(0, h.target - h.dead), hHi = Math.min(100, h.target + h.dead);
    const lo = Math.max(0, svp(tC - tdC) * (1 - hHi / 100));
    const hi = Math.max(0, svp(tC + tdC) * (1 - hLo / 100));
    return hi > lo ? { lo, hi } : null;
  }
  // A metric's healthy band [lo,hi] + a near-edge margin, unified across the
  // target metrics (Temp/Humi/CO2 = target ± dead zone, margin = dead zone),
  // Air VPD (implied range from targets) and Leaf VPD (its min/max). null when
  // the metric has no target/range.
  // The target-derived band (Temp/Humi/CO2 = target ± dead; Air VPD = implied
  // range; Leaf VPD = min/max), independent of the colour source.
  private targetBandRaw(suffix: string): { lo: number; hi: number; margin: number } | null {
    const ti = this.targetInfo(suffix);
    if (ti) return { lo: ti.target - ti.dead, hi: ti.target + ti.dead, margin: ti.dead };
    if (suffix === "vpd") {
      const r = this.airVpdRange();
      return r && r.hi > r.lo ? { lo: r.lo, hi: r.hi, margin: (r.hi - r.lo) * 0.15 } : null;
    }
    if (suffix === "leaf_vpd") {
      const { min, max } = this.leafVpdRange();
      return min != null && max != null && max > min
        ? { lo: min, hi: max, margin: (max - min) * 0.15 } : null;
    }
    // Soil metrics have no device env target — use their (enabled) substrate
    // alarm min/max as the target, so the soil tiles show it in any colour-source
    // mode (including "targets"). Null when that soil alarm is off. (v3.19.165)
    if (suffix.startsWith("soil_avg_")) {
      const a = this.alarmRange(suffix);
      if (a) return { lo: a.lo, hi: a.hi, margin: (a.hi - a.lo) * 0.06 };
    }
    return null;
  }
  // The enabled alarm min/max for a metric (Alerts tab), or null.
  private alarmRange(suffix: string): { lo: number; hi: number } | null {
    const key = PARAM_ALARM[suffix];
    if (!key) return null;
    const s = this.alertsSettings();
    if (!s) return null;
    const m = [...(s.climate || []), ...(s.substrate || [])].find(
      (x: any) => x && x.key === key);
    if (!m || !m.enabled) return null;
    const lo = Number(m.min), hi = Number(m.max);
    return Number.isFinite(lo) && Number.isFinite(hi) && hi > lo ? { lo, hi } : null;
  }
  // The band shown/compared, following the colour source: Targets = the target
  // band; Alarms = the alarm min/max range (no amber margin); Both = target if
  // it exists, else the alarm range. Leaf VPD always uses its own band.
  private metricBand(suffix: string): { lo: number; hi: number; margin: number } | null {
    const t = this.targetBandRaw(suffix);
    if (suffix === "leaf_vpd") return t;
    if (this.colorSource === "targets") return t;
    const a = this.alarmRange(suffix);
    const aband = a ? { lo: a.lo, hi: a.hi, margin: 0 } : null;
    if (this.colorSource === "alarms") return aband;
    return t ?? aband;   // both
  }
  // 4-state: beyond the near-edge margin = above/below; inside the margin but
  // outside the band = near; within the band = in (null).
  private targetOutOfRange(suffix: string, v: number): "above" | "below" | "near" | null {
    const b = this.metricBand(suffix);
    if (!b) return null;
    if (v > b.hi + b.margin) return "above";
    if (v < b.lo - b.margin) return "below";
    if (v > b.hi || v < b.lo) return "near";
    return null;
  }
  // "target 72°F · ±2" (a single target), else "target 0.80–1.20 kPa" (a target
  // range) or "range 16–32 °F" (the alarm limits when colouring by Alarms) — so
  // the healthy range is always legible at a glance, whatever the source.
  private targetSubline(suffix: string, unit: string) {
    if (!this.showTargets) return nothing;
    const ti = this.targetInfo(suffix);
    if (this.colorSource !== "alarms" && ti)
      return html`<div class="tile-target">target ${ti.target}${unit} · ±${ti.dead}</div>`;
    const b = this.metricBand(suffix);
    if (!b) return nothing;
    const word = this.colorSource !== "alarms" || suffix === "leaf_vpd" ? "target" : "range";
    const mid = Math.abs((b.lo + b.hi) / 2);
    // Decimals by unit: VPD needs 2, EC 1, temp/%/ppm/PPFD are whole; fall back to
    // a magnitude rule for anything else.
    const u = unit || "";
    const dec = /kpa/i.test(u) ? 2
      : /ms\/cm/i.test(u) ? 1
      : /°|%|ppm|µmol/.test(u) ? 0
      : (mid < 10 ? 2 : mid < 100 ? 1 : 0);
    return html`<div class="tile-target">${word} ${b.lo.toFixed(dec)}–${b.hi.toFixed(dec)} ${unit}</div>`;
  }

  // ── Overview extras: recent-history sampling, trend, dead-zone band, graph ──
  private paramEid(suffix: string): string {
    return `sensor.sf_${this.config.panel}_${suffix}`;
  }
  // A tiny in-memory history of each overview reading (no recorder call), so a
  // trend arrow can be shown. Capped to ~20 min / 60 samples per entity.
  private recordHistory(): void {
    const now = Date.now();
    for (const [suffix] of PARAMS) {
      const e = this.get(this.paramEid(suffix));
      const v = e ? parseFloat(e.state) : NaN;
      if (!Number.isFinite(v)) continue;
      const eid = this.paramEid(suffix);
      const arr = this._hist[eid] || (this._hist[eid] = []);
      const last = arr[arr.length - 1];
      if (!last || last.v !== v || now - last.t > 60000) arr.push({ t: now, v });
      while (arr.length > 60 || (arr.length && now - arr[0].t > 20 * 60000)) arr.shift();
    }
  }
  private trend(suffix: string): "up" | "down" | "flat" | null {
    const arr = this._hist[this.paramEid(suffix)];
    if (!arr || arr.length < 3) return null;
    const first = arr[0].v, last = arr[arr.length - 1].v;
    const span = arr.reduce((m, s) => Math.max(m, Math.abs(s.v)), 0) || 1;
    if (Math.abs(last - first) < Math.max(0.05, span * 0.004)) return "flat";
    return last > first ? "up" : "down";
  }
  private trendIcon(suffix: string) {
    if (!this.showTrend) return nothing;
    const t = this.trend(suffix);
    if (!t) return nothing;
    const icon = t === "up" ? "mdi:trending-up"
      : t === "down" ? "mdi:trending-down" : "mdi:trending-neutral";
    const col = t === "up" ? "#ff8a65"
      : t === "down" ? "#5db2ff" : "var(--secondary-text-color)";
    return html`<ha-icon class="tile-trend" icon=${icon} style="color:${col}"></ha-icon>`;
  }
  // Scale + zones for a tile's dead-zone band, or null when the metric has no
  // target/range to draw. Target metrics get a green band + amber margin; Leaf
  // VPD uses its own min/max band.
  private bandInfo(suffix: string): {
    min: number; max: number; bandLo: number; bandHi: number;
    warnLo: number; warnHi: number;
  } | null {
    const b = this.metricBand(suffix);
    if (!b) return null;
    const width = b.hi - b.lo;
    return {
      min: b.lo - width - b.margin, max: b.hi + width + b.margin,
      bandLo: b.lo, bandHi: b.hi,
      warnLo: b.lo - b.margin, warnHi: b.hi + b.margin,
    };
  }
  private renderBand(suffix: string, v: number) {
    if (!this.showBand || !Number.isFinite(v)) return nothing;
    const b = this.bandInfo(suffix);
    if (!b) return nothing;
    // Widen the scale so the current value is always inside it — the marker then
    // never clamps to (and gets clipped at) an edge; its position also shows how
    // far past the band the reading sits.
    let min = b.min, max = b.max;
    const range = (max - min) || 1;
    if (v < min) min = v - range * 0.06;
    if (v > max) max = v + range * 0.06;
    const pc = (x: number) => Math.max(0, Math.min(100, (x - min) / (max - min) * 100));
    return html`<div class="tile-band">
      <div class="bz" style=${`left:${pc(b.warnLo)}%;width:${pc(b.warnHi) - pc(b.warnLo)}%;background:${tint(this.colWarn, 0.28)}`}></div>
      <div class="bz" style=${`left:${pc(b.bandLo)}%;width:${pc(b.bandHi) - pc(b.bandLo)}%;background:${tint(this.colIn, 0.42)}`}></div>
      <div class="bmark" style=${`left:${pc(v)}%`}></div>
    </div>`;
  }
  // Per-range history cache key so switching the range refetches its own window.
  private _gkey(eid: string): string { return `${eid}|${this.graphRange}`; }
  // Tap-for-graph: toggle the inline history sparkline for a tile.
  private toggleGraph(suffix: string): void {
    const open = this.paramOpen === suffix;
    this.paramOpen = open ? null : suffix;
    this._graphSel = null;
    this._graphPin = null;
    if (this._graphTimer != null) { clearInterval(this._graphTimer); this._graphTimer = null; }
    if (!open) {
      this.fetchGraph(this.paramEid(suffix));
      // Refresh the open graph every ~10s so it keeps re-fetching new points and
      // advancing the live "now" edge even when little else on the view changes.
      // Self-clears once the graph is closed. (v0.21.63)
      this._graphTimer = window.setInterval(() => {
        if (this.paramOpen == null) {
          if (this._graphTimer != null) { clearInterval(this._graphTimer); this._graphTimer = null; }
          return;
        }
        this._graphVer++;   // allowlisted in shouldUpdate — forces the re-render
      }, 10000);
    }
  }
  // Every entity feeding a metric's multi-line graph: each probe + the average.
  private soilGraphEids(metric: "temperature" | "moisture" | "ec"): string[] {
    const probes = this.soilProbeRows(metric).map((r) => r.eid);
    return [...probes, this.paramEid(`soil_avg_${metric}`)];
  }
  // Chart-icon tap on a soil tile: toggle the multi-line probe history graph.
  // Mirrors toggleGraph's refresh timer, but keyed on soilGraphOpen and fetching
  // every probe series up front so the lines appear together. (v0.21.74)
  private toggleSoilGraph(metric: "temperature" | "moisture" | "ec"): void {
    const open = this.soilGraphOpen === metric;
    this.soilGraphOpen = open ? null : metric;
    this._graphSel = null;
    this._graphPin = null;
    if (this._graphTimer != null) { clearInterval(this._graphTimer); this._graphTimer = null; }
    if (!open) {
      for (const eid of this.soilGraphEids(metric)) this.fetchGraph(eid);
      this._graphTimer = window.setInterval(() => {
        if (this.soilGraphOpen == null && this.paramOpen == null) {
          if (this._graphTimer != null) { clearInterval(this._graphTimer); this._graphTimer = null; }
          return;
        }
        this._graphVer++;
      }, 10000);
    }
  }
  // Change the tile-graph window (hours) and remember it server-side.
  private setGraphRange(hrs: number): void {
    if (hrs === this.graphRange) return;
    this.graphRange = hrs;
    this._graphSel = null;
    this._graphPin = null;
    this.persistColorOption("graph_range", String(hrs));
    if (this.paramOpen) this.fetchGraph(this.paramEid(this.paramOpen));
    if (this.soilGraphOpen)
      for (const eid of this.soilGraphEids(this.soilGraphOpen)) this.fetchGraph(eid);
    if (this.deviceGraphOpen) {
      const ls = this.deviceLevelSensor(this.deviceGraphOpen.split(":")[1]);
      if (ls) this.fetchGraph(ls.eid);
    }
  }
  // The S-Station power graph can plot Watts / Volts / Amps / kWh. Remembered
  // server-side like the range. (v0.21.85)
  private static readonly POWER_METRICS: { key: string; label: string }[] = [
    { key: "power", label: "Watts" },
    { key: "voltage", label: "Volts" },
    { key: "current", label: "Amps" },
    { key: "energy", label: "kWh" },
  ];
  private setPowerMetric(key: string): void {
    if (key === this.powerMetric) return;
    this.powerMetric = key;
    this._graphSel = null;
    this._graphPin = null;
    this.persistColorOption("power_metric", key);
    if (this.paramOpen === "power") this.fetchGraph(this.paramEid(key));
  }
  private async fetchGraph(eid: string): Promise<void> {
    const key = this._gkey(eid);
    // Re-fetch when the cache is older than 15s so an open graph keeps pulling
    // newly-recorded points and stays current (matches PPFD, which only looked
    // current because it changes constantly). (v0.21.63)
    const fresh = this._graphAt[key] != null && (Date.now() - this._graphAt[key] < 15000);
    if ((this._graph[key] && fresh) || this._graphLoading[key] || !this.hass) return;
    this._graphLoading[key] = true;
    try {
      const end = new Date();
      const start = new Date(end.getTime() - this.graphRange * 3600 * 1000);
      const res: any = await (this.hass as any).callWS({
        type: "history/history_during_period",
        start_time: start.toISOString(), end_time: end.toISOString(),
        entity_ids: [eid], minimal_response: true, no_attributes: true,
      });
      const rows: any[] = (res && res[eid]) || [];
      this._graph[key] = rows.map((r) => ({
        t: r.lu != null ? r.lu * 1000 : Date.parse(r.last_updated ?? r.last_changed),
        v: parseFloat(r.s ?? r.state),
      })).filter((p) => Number.isFinite(p.v) && Number.isFinite(p.t));
      this._graphAt[key] = Date.now();
    } catch (_e) {
      this._graph[key] = [];
    } finally {
      this._graphLoading[key] = false;
      this._graphVer++;   // reactive — forces a re-render past shouldUpdate
    }
  }
  // Single-line history graph. By default it draws the open param tile
  // (this.paramOpen) with its target band/alarm colouring. Pass `src` to draw an
  // arbitrary sensor instead (device-level popouts) — no band, plain colouring,
  // and its own close handler. (v0.21.75)
  private renderParamGraph(src?: { eid: string; label: string; onClose: () => void }) {
    const suffix = src ? null : this.paramOpen;
    if (!src && !suffix) return nothing;
    // The S-Station Power graph can plot a chosen metric (Watts/Volts/Amps/kWh);
    // the picker re-points the graph at the matching sensor. (v0.21.85)
    const isPower = !src && suffix === "power";
    const pm = isPower
      ? (SpiderFarmerCard.POWER_METRICS.find((m) => m.key === this.powerMetric)
         ?? SpiderFarmerCard.POWER_METRICS[0])
      : null;
    const eid = src ? src.eid : this.paramEid(isPower ? pm!.key : suffix as string);
    const key = this._gkey(eid);
    const label = src ? src.label
      : isPower ? pm!.label
      : (PARAMS.find((p) => p[0] === suffix)
        || [, (suffix as string).charAt(0).toUpperCase() + (suffix as string).slice(1)])[1];
    const unit = this.get(eid)?.attributes.unit_of_measurement || "";
    // A device level graph with no unit is an integer gear (fan speed, heater /
    // humidifier level): draw whole-number axis bounds and labels so a 0–4 gear
    // reads "4", not a padded "4.32". (v0.21.75)
    const gear = !!src && !unit;
    const closeGraph = () => {
      this._graphSel = null; this._graphPin = null;
      if (src) src.onClose(); else this.paramOpen = null;
    };
    const rangeSel = html`<select class="pg-range" @change=${(e: Event) =>
        this.setGraphRange(Number((e.target as HTMLSelectElement).value))}>
      ${[[1, "1h"], [6, "6h"], [12, "12h"], [24, "24h"], [168, "7d"]].map(([v, l]) => html`
        <option value=${v} ?selected=${this.graphRange === v}>${l}</option>`)}
    </select>`;
    // S-Station power graph: a metric picker (Watts/Volts/Amps/kWh) beside the range. (v0.21.85)
    const metricSel = isPower ? html`<select class="pg-range" @change=${(e: Event) =>
        this.setPowerMetric((e.target as HTMLSelectElement).value)}>
      ${SpiderFarmerCard.POWER_METRICS.map((m) => html`
        <option value=${m.key} ?selected=${this.powerMetric === m.key}>${m.label}</option>`)}
    </select>` : nothing;
    if (this._graphLoading[key])
      return html`<div class="param-graph"><div class="pg-head"><span>${label}</span>${metricSel}${rangeSel}<span class="pg-now">…</span><ha-icon icon="mdi:close" @click=${closeGraph}></ha-icon></div><span class="pg-note">Loading history…</span></div>`;
    // Keep the open graph current — re-fetches only when the cache is stale.
    this.fetchGraph(eid);
    const raw = this._graph[key];
    // Extend to NOW with the current live value so every graph reaches the present
    // (a held value stays flat to now) — the same reason PPFD always looks current —
    // and so a rock-steady sensor (soil moisture) still has enough points to draw.
    // (v0.21.63)
    const liveE = this.get(eid);
    const liveV = liveE && liveE.state !== "unavailable" && liveE.state !== "unknown"
      ? parseFloat(liveE.state) : NaN;
    const nowMs = Date.now();
    const pts = (raw && raw.length && Number.isFinite(liveV)
                 && nowMs - raw[raw.length - 1].t > 1000)
      ? [...raw, { t: nowMs, v: liveV }]
      : (raw || []);
    if (pts.length < 2)
      return html`<div class="param-graph"><div class="pg-head"><span>${label}</span>${metricSel}${rangeSel}<span class="pg-now"></span><ha-icon icon="mdi:close" @click=${closeGraph}></ha-icon></div><span class="pg-note">Not enough history yet for ${label} at this range.</span></div>`;

    const vals = pts.map((p) => p.v);
    const vmin = Math.min(...vals), vmax = Math.max(...vals);
    const avg = vals.reduce((a, c) => a + c, 0) / vals.length;
    const last = vals[vals.length - 1];
    const dec = gear ? 0 : Math.abs(avg) < 10 ? 2 : Math.abs(avg) < 100 ? 1 : 0;
    const f = (n: number) => n.toFixed(dec);
    const b = src ? null : this.bandInfo(suffix as string);
    const oor = src ? null
      : (suffix === "leaf_vpd" || this.colorSource !== "alarms"
        ? this.targetOutOfRange(suffix as string, last) : this.outOfRange(PARAM_ALARM[suffix as string], last));
    const nowCol = oor === "above" ? this.colHi : oor === "below" ? this.colLo
      : oor === "near" ? this.colWarn : "var(--primary-text-color)";

    const w = 520, h = 120, padX = 6, padT = 6, padB = 6;
    const t0 = pts[0].t, t1 = pts[pts.length - 1].t || t0 + 1;
    let lo = vmin, hi = vmax;
    if (gear) {
      // Whole-number gear axis: floor/ceil, and open a 1-unit window for a flat
      // line so it isn't pinned to an edge. Gears never go negative.
      lo = Math.floor(vmin); hi = Math.ceil(vmax);
      if (hi - lo < 1) { lo -= 1; hi += 1; }
      lo = Math.max(0, lo);
    } else {
      if (b) { lo = Math.min(lo, b.warnLo); hi = Math.max(hi, b.warnHi); }
      const vpad = (hi - lo) * 0.08 || 1; lo -= vpad; hi += vpad;
      // PPFD / humidity / CO2 / VPD / soil can't go negative — don't let the padded
      // axis floor drop below 0 (a user's PPFD graph showed a "-65" y-axis tick, a
      // scale artifact, not a real reading). Temperature CAN be below zero, so only
      // clamp when nothing in view is actually negative. (v0.21.58)
      if (vmin >= 0 && (!b || b.warnLo >= 0)) lo = Math.max(0, lo);
      // Percentage metrics (fan/blower speed, brightness, humidity, moisture) can't
      // exceed 100 — don't let the 8% headroom push the axis top past 100 (a blower
      // at 100% showed a "108.0" y-axis top). (v0.21.83)
      if (unit === "%" && vmax <= 100) hi = Math.min(100, hi);
    }
    const x = (t: number) => padX + (t - t0) / (t1 - t0) * (w - 2 * padX);
    const y = (v: number) => h - padB - (v - lo) / (hi - lo) * (h - padT - padB);
    // Step-after line: HA's recorder stores a value once and it stays in effect
    // until the next recorded change, so a held value (PPFD 0 overnight, a steady
    // temp) is a flat segment — not a diagonal ramp to the next point. Hold each
    // value level until the next point's time, then step to it. (v0.21.62)
    const px = (t: number) => x(t).toFixed(1), pyv = (v: number) => y(v).toFixed(1);
    let _d = `M${px(pts[0].t)} ${pyv(pts[0].v)}`;
    for (let i = 1; i < pts.length; i++)
      _d += ` L${px(pts[i].t)} ${pyv(pts[i - 1].v)} L${px(pts[i].t)} ${pyv(pts[i].v)}`;
    const line = _d;
    // Power/energy graph: fill the area from the line down to the 0 baseline so the
    // signal reads as a level sitting ABOVE 0 (bottom), not a line hanging off the
    // top. A line-only render of a high, noisy current draw looked "inverted". (v0.21.87)
    const yBase = (h - padB).toFixed(1);
    const area = isPower
      ? `${line} L${px(pts[pts.length - 1].t)} ${yBase} L${px(pts[0].t)} ${yBase} Z`
      : null;
    const accent = this.accent();
    const iMin = vals.indexOf(vmin), iMax = vals.indexOf(vmax);
    const fmtT = (t: number) =>
      new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const guide = (v: number, col: string) => svg`<line x1="0" x2=${w} y1=${y(v).toFixed(1)} y2=${y(v).toFixed(1)} stroke=${col} stroke-width="1" stroke-dasharray="3 3" opacity="0.6"></line>`;

    // #2: x-axis ticks + labels — clock times for hour ranges, dates for 7d.
    const axisFmt = (t: number) => this.graphRange >= 168
      ? new Date(t).toLocaleDateString([], { month: "numeric", day: "numeric" })
      : new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: this.hour12 });
    const NT = this.graphRange >= 168 ? 7 : 6;
    const ticks = Array.from({ length: NT + 1 }, (_, i) => t0 + (i / NT) * (t1 - t0));

    // #3: hover previews a point (value + time in the head); a click PINS it so it
    // stays after the pointer leaves. Leave reverts to the pinned point (if any).
    // Store the cursor TIME (not a point index). The readout shows the value in
    // effect at that time — the last recorded value at or before it (step/hold) —
    // so it follows the cursor smoothly across the whole width, including held
    // regions with few points, instead of snapping to the nearest point. (v0.21.62)
    const selT = this._graphSel != null ? this._graphSel
      : (this._graphPin != null ? this._graphPin : null);
    const sel = selT != null ? this._graphSampleAt(pts, selT) : null;
    const pick = (ev: PointerEvent, pin: boolean) => {
      const r = (ev.currentTarget as SVGElement).getBoundingClientRect();
      if (!r.width) return;
      const frac = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width));
      const tt = t0 + frac * (t1 - t0);
      this._graphSel = tt;
      if (pin) this._graphPin = tt;
    };
    const headVal = sel != null ? sel.v : last;

    return html`<div class="param-graph">
      <div class="pg-head">
        <span>${label}</span>${metricSel}${rangeSel}
        <span class="pg-now" style="color:${sel != null ? "var(--primary-text-color)" : nowCol}">
          ${sel != null ? html`<span class="pg-at">${fmtT(sel.t)}</span> ` : nothing}${f(headVal)}<span class="pg-u">${unit}</span></span>
        <ha-icon icon="mdi:close" @click=${closeGraph}></ha-icon>
      </div>
      <div class="pg-stats">
        <span>min <b>${f(vmin)}</b></span><span>avg <b>${f(avg)}</b></span>
        <span>max <b>${f(vmax)}</b></span>
        ${b ? html`<span>band <b>${f(b.bandLo)}–${f(b.bandHi)}</b> ${unit}</span>` : nothing}
      </div>
      <div class="pg-plot">
        <div class="pg-yax"><span>${f(hi)}</span><span>${f(lo)}</span></div>
        <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" class="pg-svg"
          @pointermove=${(e: PointerEvent) => pick(e, false)}
          @pointerdown=${(e: PointerEvent) => {
            (e.currentTarget as Element).setPointerCapture?.(e.pointerId);
            pick(e, true);
          }}
          @pointerleave=${() => { this._graphSel = null; }}>
          ${ticks.map((tk) => svg`<line x1=${x(tk).toFixed(1)} x2=${x(tk).toFixed(1)} y1="0" y2=${h} stroke="var(--divider-color, #333)" stroke-width="1" opacity="0.35"></line>`)}
          ${b ? svg`
            <rect x="0" y=${y(b.warnHi).toFixed(1)} width=${w} height=${(y(b.bandHi) - y(b.warnHi)).toFixed(1)} fill=${tint(this.colWarn, 0.16)}></rect>
            <rect x="0" y=${y(b.bandLo).toFixed(1)} width=${w} height=${(y(b.warnLo) - y(b.bandLo)).toFixed(1)} fill=${tint(this.colWarn, 0.16)}></rect>
            <rect x="0" y=${y(b.bandHi).toFixed(1)} width=${w} height=${(y(b.bandLo) - y(b.bandHi)).toFixed(1)} fill=${tint(this.colIn, 0.20)}></rect>
            ${guide(b.bandHi, this.colIn)}${guide(b.bandLo, this.colIn)}` : nothing}
          ${area ? svg`<path d=${area} fill=${tint(accent, 0.18)} stroke="none"></path>` : nothing}
          <path d=${line} fill="none" stroke=${accent} stroke-width="2"></path>
          <circle cx=${x(pts[iMin].t).toFixed(1)} cy=${y(vmin).toFixed(1)} r="2.5" fill=${this.colLo}></circle>
          <circle cx=${x(pts[iMax].t).toFixed(1)} cy=${y(vmax).toFixed(1)} r="2.5" fill=${this.colHi}></circle>
          <circle cx=${x(pts[pts.length - 1].t).toFixed(1)} cy=${y(last).toFixed(1)} r="3.5" fill=${accent}></circle>
          ${sel != null ? svg`
            <line x1=${x(sel.t).toFixed(1)} x2=${x(sel.t).toFixed(1)} y1="0" y2=${h} stroke="var(--secondary-text-color)" stroke-width="1" opacity="0.7"></line>
            <circle cx=${x(sel.t).toFixed(1)} cy=${y(sel.v).toFixed(1)} r="4" fill="var(--primary-text-color)"></circle>` : nothing}
          <rect x="0" y="0" width=${w} height=${h} fill="transparent"></rect>
        </svg>
      </div>
      <div class="pg-xax">${ticks.map((tk) => html`<span>${axisFmt(tk)}</span>`)}</div>
    </div>`;
  }

  // The numeric level sensor behind a device tile (light brightness %, fan/blower
  // speed, heater/humidifier level), or null for devices with no graphable level
  // (dehumidifier = Low/High text). Only returns it when the sensor exists on this
  // controller, so the chart icon auto-hides otherwise. (v0.21.75)
  private deviceLevelSensor(suffix: string): { eid: string; word: string } | null {
    let sub: string, word: string;
    if (suffix.startsWith("light")) { sub = `${suffix}_brightness`; word = "Brightness"; }
    else if (suffix === "fan") { sub = "fan_speed"; word = "Speed"; }
    else if (suffix === "blower") { sub = "blower_speed"; word = "Speed"; }
    else if (suffix === "heater") { sub = "heater_level"; word = "Level"; }
    else if (suffix === "humidifier") { sub = "humidifier_level"; word = "Level"; }
    else return null;
    const eid = `sensor.sf_${this.config.panel}_${sub}`;
    return this.get(eid) ? { eid, word } : null;
  }
  // The device tile's level history graph — a single-line param graph pointed at
  // the device's level sensor, with its own close handler. (v0.21.75)
  private renderDeviceGraph(d: { domain: string; suffix: string; label: string }) {
    const ls = this.deviceLevelSensor(d.suffix);
    if (!ls) return nothing;
    return this.renderParamGraph({
      eid: ls.eid, label: `${d.label} · ${ls.word}`,
      onClose: () => { this.deviceGraphOpen = null; },
    });
  }
  // Chart-icon tap on a device tile: toggle its level history graph. Mirrors the
  // soil-graph timer; keyed on deviceGraphOpen. (v0.21.75)
  private toggleDeviceGraph(key: string): void {
    const open = this.deviceGraphOpen === key;
    this.deviceGraphOpen = open ? null : key;
    this._graphSel = null;
    this._graphPin = null;
    if (this._graphTimer != null) { clearInterval(this._graphTimer); this._graphTimer = null; }
    if (!open) {
      const ls = this.deviceLevelSensor(key.split(":")[1]);
      if (ls) this.fetchGraph(ls.eid);
      this._graphTimer = window.setInterval(() => {
        if (this.deviceGraphOpen == null && this.soilGraphOpen == null && this.paramOpen == null) {
          if (this._graphTimer != null) { clearInterval(this._graphTimer); this._graphTimer = null; }
          return;
        }
        this._graphVer++;
      }, 10000);
    }
  }

  // Short label for a soil metric, from the PARAMS tile label ("Soil Temp" /
  // "Moisture" / "Soil EC") so the graph and breakdown headers read identically.
  private soilMetricLabel(metric: "temperature" | "moisture" | "ec"): string {
    const suffix = `soil_avg_${metric}`;
    return (PARAMS.find((p) => p[0] === suffix)
      || [, metric.charAt(0).toUpperCase() + metric.slice(1)])[1] as string;
  }
  // Multi-line soil history: one line per probe plus the average (accent, thick),
  // opened by the chart icon on a soil-average tile. Shares the graph cache,
  // range selector and scrub cursor with the single-line param graph; the per-
  // probe values live in a legend that follows the cursor. (v0.21.74)
  private renderSoilGraph(metric: "temperature" | "moisture" | "ec") {
    const suffix = `soil_avg_${metric}`;
    const avgEid = this.paramEid(suffix);
    const label = this.soilMetricLabel(metric);
    const unit = this.get(avgEid)?.attributes.unit_of_measurement || "";
    const rangeSel = html`<select class="pg-range" @change=${(e: Event) =>
        this.setGraphRange(Number((e.target as HTMLSelectElement).value))}>
      ${[[1, "1h"], [6, "6h"], [12, "12h"], [24, "24h"], [168, "7d"]].map(([v, l]) => html`
        <option value=${v} ?selected=${this.graphRange === v}>${l}</option>`)}
    </select>`;
    const close = html`<ha-icon icon="mdi:close" @click=${() => {
      this.soilGraphOpen = null; this._graphSel = null; this._graphPin = null; }}></ha-icon>`;
    const head = (mid: unknown) => html`<div class="pg-head">
      <span>${label} · By Probe</span>${rangeSel}<span class="pg-now">${mid}</span>${close}</div>`;

    // Build one series per probe + the average. Each series extends to NOW with
    // its live value so the lines reach the present (matches the param graph).
    type S = { name: string; color: string; width: number;
               pts: { t: number; v: number }[]; live: number; off: boolean };
    let anyLoading = false;
    const buildPts = (eid: string) => {
      const key = this._gkey(eid);
      if (this._graphLoading[key]) anyLoading = true;
      this.fetchGraph(eid);
      const raw = this._graph[key] || [];
      const le = this.get(eid);
      const lv = le && le.state !== "unavailable" && le.state !== "unknown"
        ? parseFloat(le.state) : NaN;
      const now = Date.now();
      return raw.length && Number.isFinite(lv) && now - raw[raw.length - 1].t > 1000
        ? [...raw, { t: now, v: lv }] : raw;
    };
    const series: S[] = this.soilProbeRows(metric).map((p, i) => {
      const le = this.get(p.eid);
      return {
        name: p.name, color: SOIL_LINE_COLORS[i % SOIL_LINE_COLORS.length], width: 1.5,
        pts: buildPts(p.eid),
        live: le ? parseFloat(le.state) : NaN, off: isOffline(le),
      };
    });
    const avgLe = this.get(avgEid);
    series.push({
      name: "Average", color: this.accent(), width: 2.6, pts: buildPts(avgEid),
      live: avgLe ? parseFloat(avgLe.state) : NaN, off: isOffline(avgLe),
    });

    if (anyLoading && series.every((s) => !s.pts.length))
      return html`<div class="param-graph">${head(html`…`)}<span class="pg-note">Loading history…</span></div>`;
    const drawable = series.filter((s) => s.pts.length >= 2);
    if (!drawable.length)
      return html`<div class="param-graph">${head(nothing)}<span class="pg-note">Not enough history yet at this range.</span></div>`;

    const allV = drawable.flatMap((s) => s.pts.map((p) => p.v));
    const vmin = Math.min(...allV), vmax = Math.max(...allV);
    const b = this.bandInfo(suffix);
    let lo = vmin, hi = vmax;
    if (b) { lo = Math.min(lo, b.warnLo); hi = Math.max(hi, b.warnHi); }
    const vpad = (hi - lo) * 0.08 || 1; lo -= vpad; hi += vpad;
    if (vmin >= 0 && (!b || b.warnLo >= 0)) lo = Math.max(0, lo);

    const t0 = Math.min(...drawable.map((s) => s.pts[0].t));
    const t1 = Math.max(...drawable.map((s) => s.pts[s.pts.length - 1].t)) || t0 + 1;
    const w = 520, h = 120, padX = 6, padT = 6, padB = 6;
    const x = (t: number) => padX + (t - t0) / (t1 - t0) * (w - 2 * padX);
    const y = (v: number) => h - padB - (v - lo) / (hi - lo) * (h - padT - padB);
    const mid = (vmin + vmax) / 2;
    const dec = Math.abs(mid) < 10 ? 2 : Math.abs(mid) < 100 ? 1 : 0;
    const f = (n: number) => n.toFixed(dec);
    const stepPath = (pts: { t: number; v: number }[]) => {
      const px = (t: number) => x(t).toFixed(1), py = (v: number) => y(v).toFixed(1);
      let d = `M${px(pts[0].t)} ${py(pts[0].v)}`;
      for (let i = 1; i < pts.length; i++)
        d += ` L${px(pts[i].t)} ${py(pts[i - 1].v)} L${px(pts[i].t)} ${py(pts[i].v)}`;
      return d;
    };
    const axisFmt = (t: number) => this.graphRange >= 168
      ? new Date(t).toLocaleDateString([], { month: "numeric", day: "numeric" })
      : new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: this.hour12 });
    const NT = this.graphRange >= 168 ? 7 : 6;
    const ticks = Array.from({ length: NT + 1 }, (_, i) => t0 + (i / NT) * (t1 - t0));
    const fmtT = (t: number) => new Date(t).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const selT = this._graphSel != null ? this._graphSel
      : (this._graphPin != null ? this._graphPin : null);
    const selC = selT != null ? Math.max(t0, Math.min(t1, selT)) : null;
    const pick = (ev: PointerEvent, pin: boolean) => {
      const r = (ev.currentTarget as SVGElement).getBoundingClientRect();
      if (!r.width) return;
      const frac = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width));
      const tt = t0 + frac * (t1 - t0);
      this._graphSel = tt; if (pin) this._graphPin = tt;
    };

    return html`<div class="param-graph">
      ${head(selC != null ? html`<span class="pg-at">${fmtT(selC)}</span>` : nothing)}
      <div class="pg-plot">
        <div class="pg-yax"><span>${f(hi)}</span><span>${f(lo)}</span></div>
        <svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" class="pg-svg"
          @pointermove=${(e: PointerEvent) => pick(e, false)}
          @pointerdown=${(e: PointerEvent) => {
            (e.currentTarget as Element).setPointerCapture?.(e.pointerId); pick(e, true); }}
          @pointerleave=${() => { this._graphSel = null; }}>
          ${ticks.map((tk) => svg`<line x1=${x(tk).toFixed(1)} x2=${x(tk).toFixed(1)} y1="0" y2=${h} stroke="var(--divider-color, #333)" stroke-width="1" opacity="0.35"></line>`)}
          ${b ? svg`
            <rect x="0" y=${y(b.bandHi).toFixed(1)} width=${w} height=${(y(b.bandLo) - y(b.bandHi)).toFixed(1)} fill=${tint(this.colIn, 0.14)}></rect>
            <line x1="0" x2=${w} y1=${y(b.bandHi).toFixed(1)} y2=${y(b.bandHi).toFixed(1)} stroke=${this.colIn} stroke-width="1" stroke-dasharray="3 3" opacity="0.5"></line>
            <line x1="0" x2=${w} y1=${y(b.bandLo).toFixed(1)} y2=${y(b.bandLo).toFixed(1)} stroke=${this.colIn} stroke-width="1" stroke-dasharray="3 3" opacity="0.5"></line>` : nothing}
          ${drawable.map((s) => svg`<path d=${stepPath(s.pts)} fill="none" stroke=${s.color} stroke-width=${s.width} opacity=${s.name === "Average" ? 1 : 0.85}></path>`)}
          ${selC != null ? svg`
            <line x1=${x(selC).toFixed(1)} x2=${x(selC).toFixed(1)} y1="0" y2=${h} stroke="var(--secondary-text-color)" stroke-width="1" opacity="0.7"></line>
            ${drawable.map((s) => { const p = this._graphSampleAt(s.pts, selC); return svg`<circle cx=${x(p.t).toFixed(1)} cy=${y(p.v).toFixed(1)} r="3" fill=${s.color}></circle>`; })}` : nothing}
          <rect x="0" y="0" width=${w} height=${h} fill="transparent"></rect>
        </svg>
      </div>
      <div class="pg-xax">${ticks.map((tk) => html`<span>${axisFmt(tk)}</span>`)}</div>
      <div class="pg-legend">
        ${series.map((s) => {
          const sampled = selC != null && s.pts.length ? this._graphSampleAt(s.pts, selC).v : s.live;
          const txt = s.off && selC == null ? "offline"
            : (Number.isFinite(sampled) ? `${f(sampled)}${unit}` : "—");
          return html`<span class="pg-leg ${s.name === "Average" ? "avg" : ""}">
            <i style="background:${s.color}"></i>${s.name} <b>${txt}</b></span>`;
        })}
      </div>
    </div>`;
  }

  // The value in effect at time t: the last recorded point at or before t (a
  // recorder value holds until the next change). Clamped to the data's time span.
  // Lets the scrubber report a value anywhere on the timeline, not just at a
  // recorded point. (v0.21.62)
  private _graphSampleAt(pts: { t: number; v: number }[], t: number): { t: number; v: number } {
    const t0 = pts[0].t, t1 = pts[pts.length - 1].t;
    const tt = Math.max(t0, Math.min(t1, t));
    let j = 0;
    for (let i = 0; i < pts.length; i++) { if (pts[i].t <= tt) j = i; else break; }
    return { t: tt, v: pts[j].v };
  }

  // Text-colour style for a soil breakdown value (both breakdowns colour text,
  // for tile or text mode). "" when nothing applies or the probe is offline.
  private soilCellStyle(
    slot: string, metric: "temperature" | "moisture" | "ec"
  ): string {
    const e = this.get(`sensor.sf_${this.config.panel}_${slot}_${metric}`);
    if (!e || isOffline(e)) return "";
    const key = metric === "temperature" ? "tempSoil"
      : metric === "moisture" ? "humiSoil" : "ECSoil";
    const rc = this.readingColor(key, e.state);
    return rc ? `color:${rc.color}` : "";
  }

  public getCardSize(): number {
    return 8;
  }
  static getConfigElement(): HTMLElement {
    return document.createElement("spider-farmer-card-editor");
  }
  static getStubConfig(hass?: Hass): CardConfig {
    const panels = hass ? panelSlots(hass) : [];
    const panel = panels[0] || "dp1";
    const outs = hass ? nestedOutletSlots(hass, panel) : [];
    return {
      type: "custom:spider-farmer-card",
      panel,
      ...(outs.length ? { outlets: outs } : {}),
    };
  }

  private eid(domain: string, suffix: string): string {
    return `${domain}.sf_${this.config.panel}_${suffix}`;
  }
  // Entities read during the last render — the card's live dependency set. Used by
  // shouldUpdate to skip re-rendering when a `hass` change didn't touch anything we
  // actually display (a busy HA fires a new hass on every unrelated entity, which
  // otherwise re-renders this whole card several times a second — the cause of the
  // mobile lag / dropdowns closing / Apply bouncing). (v0.21.65)
  private _used = new Set<string>();
  private get(id: string): HassEntity | undefined {
    if (id) this._used.add(id);
    return this.hass?.states[id];
  }
  // True if any entity we read last render changed state between two hass objects.
  private _hassTouchedUs(oldH?: Hass, newH?: Hass): boolean {
    if (!oldH || !newH) return true;
    if (this._used.size === 0) return true;      // haven't rendered yet — don't skip
    for (const id of this._used) if (oldH.states[id] !== newH.states[id]) return true;
    return false;
  }
  private accent(): string {
    return this.config.accent || ACCENT_DEFAULT;
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    // A hass-only change that didn't touch any entity we render → skip. Other
    // state (tab, drafts, timers, reorder…) still renders via the allowlist below.
    if (changed.size === 1 && changed.has("hass")
        && !this._hassTouchedUs(changed.get("hass") as Hass | undefined, this.hass))
      return false;
    return changed.has("config") || changed.has("hass")
      || changed.has("tab") || changed.has("soilOpen") || changed.has("soilGraphOpen")
      || changed.has("soilAllOpen") || changed.has("outletDraft")
      || changed.has("outletNameDraft") || changed.has("outletCfgDraft") || changed.has("_stDt")
      || changed.has("_cdTick")
      || changed.has("alertsDraft") || changed.has("deviceOpen") || changed.has("deviceGraphOpen")
      || changed.has("outletOpen")
      || changed.has("draft") || changed.has("modePick") || changed.has("dirPick")
      || changed.has("outletLightDir")
      || changed.has("logDate") || changed.has("logDev")
      || changed.has("logType") || changed.has("colorMode")
      || changed.has("colorModeIn") || changed.has("colHi")
      || changed.has("colLo") || changed.has("colIn")
      || changed.has("hideLight2") || changed.has("colorDraft")
      || changed.has("outletColorMode") || changed.has("ocManual")
      || changed.has("ocSched") || changed.has("ocEnv") || changed.has("ocDrip")
      || changed.has("deviceColorMode") || changed.has("dcManual")
      || changed.has("dcSched") || changed.has("dcAuto")
      || changed.has("colorSource") || changed.has("colWarn")
      || changed.has("showTrend") || changed.has("showBand")
      || changed.has("paramOpen") || changed.has("_graphVer")
      || changed.has("graphRange") || changed.has("powerMetric") || changed.has("_graphSel") || changed.has("_graphPin")
      || changed.has("showTargets") || changed.has("tileSummary")
      || changed.has("hour12")
      || changed.has("showConn") || changed.has("connCustom") || changed.has("connSignal")
      || changed.has("showOutletsLog") || changed.has("ologRange")
      || changed.has("showVpd") || changed.has("vpdLeaf") || changed.has("showLeafVpd") || changed.has("_colorOpen") || changed.has("vpdStage")
      || changed.has("vpdView") || changed.has("vpdHighlight") || changed.has("vpdPlanSource")
      || changed.has("showDeviceLog") || changed.has("showDeviceQuick")
      || changed.has("deviceQuickRemember") || changed.has("dlogOpen")
      || changed.has("planDraft") || changed.has("planEditStage") || changed.has("planShowAll")
      || changed.has("planDelArm") || changed.has("envSubView") || changed.has("_planPending")
      || changed.has("planTplOpen") || changed.has("planTplName") || changed.has("_tplMsg")
      || changed.has("ologOpen") || changed.has("_ologVer")
      || changed.has("_saving") || changed.has("outletCopyOpen") || changed.has("outletCopySel")
      || changed.has("outletCopyFromOpen")
      || changed.has("showOutletQuick") || changed.has("outletQuickRemember") || changed.has("outletQuickNames")
      || changed.has("leafSpots") || changed.has("leafCalTarget")
      || changed.has("customOutletNames") || changed.has("outletNames")
      || changed.has("customLayout") || changed.has("cardScale") || changed.has("tileCols")
      || changed.has("layoutMode") || changed.has("tileOrder")
      || changed.has("unifiedDeviceQuick") || changed.has("unifiedOutletQuick")
      || changed.has("reorderMode") || changed.has("tileOrderDraft")
      || changed.has("hiddenTiles") || changed.has("hiddenDraft")
      || changed.has("tileOrderBase") || changed.has("dragId")
      || changed.has("_devPend") || changed.has("_outPend") || changed.has("_pendLevel")
      || changed.has("tileRadius") || changed.has("tileBorderW")
      || changed.has("tileBorderCol") || changed.has("tileBg")
      || changed.has("taTiles") || changed.has("taDevices") || changed.has("taOutlets")
      || changed.has("cooldownShow") || changed.has("cooldownDevice")
      || changed.has("cooldownOutlet") || changed.has("cooldownSecs") || changed.has("_cdOpen")
      || changed.has("outletsOnOverview") || changed.has("outletQuickOverview")
      || changed.has("hideEnergyTile")
      || changed.has("_setOverviewOpen") || changed.has("_setExtrasOpen")
      || changed.has("_setConnOpen") || changed.has("_setVpdOpen")
      || changed.has("_setDevOpen") || changed.has("_setOutletOpen") || changed.has("_setLayoutOpen")
      || changed.has("tempSource") || changed.has("extTemp") || changed.has("extHumi")
      || changed.has("_tsOpen") || changed.has("smart") || changed.has("_smartOpen");
  }

  // Confirm optimistic mode picks: once the entity state matches the picked
  // value, drop the override so external changes flow through again.
  protected willUpdate(changed: PropertyValues): void {
    // Keep the Apply "Saving…" spinner up until the write has actually landed:
    // clear it on the first device state update that arrives after a short grace
    // window (so it doesn't clear on the same tick Apply was pressed). The 8s
    // hard cap in applyWithSaving covers the case where no update follows.
    if (this._saving && changed.has("hass")) {
      const elapsed = Date.now() - this._savingAt;
      // With watched entities: clear once ANY of them changes (the value/toggle
      // actually moved) — but not instantly, to ride out a same-tick echo. With
      // none: a longer grace so the tile has time to reflect the write.
      const moved = this._savingWatch.some(
        (w) => (this.get(w.id)?.state ?? "") !== w.was);
      const done = this._savingWatch.length
        ? ((moved && elapsed > 300) || elapsed > 5000)   // moved, or 5s fallback
        : elapsed > 3500;
      if (done) {
        this._saving = false;
        this._savingWatch = [];
        clearTimeout(this._savingT);
      }
    }
    // Adopt the server-persisted colour mode once it becomes available (this is
    // what makes the Settings choice survive upgrades / the mobile app / other
    // devices). A local pick sets _colorSynced first, so this never reverts an
    // in-flight change before its save round-trips.
    if (!this._colorSynced) {
      const s = this.serverColors();
      if (Object.keys(s).length) {
        if (s.mode) this.colorMode = s.mode;
        if (s.modeIn) this.colorModeIn = s.modeIn;
        if (s.source) this.colorSource = s.source;
        if (s.warn) this.colWarn = s.warn;
        if (s.showTrend !== undefined) this.showTrend = s.showTrend;
        if (s.showBand !== undefined) this.showBand = s.showBand;
        if (s.showTargets !== undefined) this.showTargets = s.showTargets;
        if (s.tileSummary !== undefined) this.tileSummary = s.tileSummary;
        if (s.hour12 !== undefined) this.hour12 = s.hour12;
        if (s.showConn !== undefined) this.showConn = s.showConn;
        if (s.connCustom !== undefined) this.connCustom = s.connCustom;
        if (s.connSignal !== undefined) this.connSignal = s.connSignal;
        if (s.showOutletsLog !== undefined) this.showOutletsLog = s.showOutletsLog;
        if (s.showOutletQuick !== undefined) this.showOutletQuick = s.showOutletQuick;
        if (s.outletQuickRemember !== undefined) this.outletQuickRemember = s.outletQuickRemember;
        if (s.outletQuickNames !== undefined) this.outletQuickNames = s.outletQuickNames;
        if (s.showVpd !== undefined) this.showVpd = s.showVpd;
        if (s.showLeafVpd !== undefined) this.showLeafVpd = s.showLeafVpd;
        if (s.vpdLeaf !== undefined) this.vpdLeaf = s.vpdLeaf;
        if (s.showDeviceLog !== undefined) this.showDeviceLog = s.showDeviceLog;
        if (s.showDeviceQuick !== undefined) this.showDeviceQuick = s.showDeviceQuick;
        if (s.deviceQuickRemember !== undefined) this.deviceQuickRemember = s.deviceQuickRemember;
        if (s.hi) this.colHi = s.hi;
        if (s.lo) this.colLo = s.lo;
        if (s.in) this.colIn = s.in;
        if (s.hide2 !== undefined) this.hideLight2 = s.hide2;
        if (s.omode) this.outletColorMode = s.omode;
        if (s.ocManual) this.ocManual = s.ocManual;
        if (s.ocSched) this.ocSched = s.ocSched;
        if (s.ocEnv) this.ocEnv = s.ocEnv;
        if (s.ocDrip) this.ocDrip = s.ocDrip;
        if (s.dmode) this.deviceColorMode = s.dmode;
        if (s.dcManual) this.dcManual = s.dcManual;
        if (s.dcSched) this.dcSched = s.dcSched;
        if (s.dcAuto) this.dcAuto = s.dcAuto;
        if (s.customNames !== undefined) this.customOutletNames = s.customNames;
        if (s.customLayout !== undefined) this.customLayout = s.customLayout;
        if (s.scale) this.cardScale = s.scale;
        if (s.cols) this.tileCols = s.cols;
        if (s.layoutMode) this.layoutMode = s.layoutMode;
        if (s.unifiedDeviceQuick !== undefined) this.unifiedDeviceQuick = s.unifiedDeviceQuick;
        if (s.unifiedOutletQuick !== undefined) this.unifiedOutletQuick = s.unifiedOutletQuick;
        if (s.tileOrder) this.tileOrder = s.tileOrder;
        if (s.graphRange) this.graphRange = s.graphRange;
        if (s.ologRange) this.ologRange = s.ologRange;
        if (s.powerMetric) this.powerMetric = s.powerMetric;
        if (s.hiddenTiles && !this.reorderMode) this.hiddenTiles = s.hiddenTiles;
        if (s.tileRadius !== undefined) this.tileRadius = s.tileRadius;
        if (s.tileBorderW !== undefined) this.tileBorderW = s.tileBorderW;
        if (s.tileBorderCol !== undefined) this.tileBorderCol = s.tileBorderCol;
        if (s.tileBg !== undefined) this.tileBg = s.tileBg;
        if (s.taTiles !== undefined) this.taTiles = s.taTiles;
        if (s.taDevices !== undefined) this.taDevices = s.taDevices;
        if (s.taOutlets !== undefined) this.taOutlets = s.taOutlets;
        if (s.cooldownShow !== undefined) this.cooldownShow = s.cooldownShow;
        if (s.cooldownDevice !== undefined) this.cooldownDevice = s.cooldownDevice;
        if (s.cooldownOutlet !== undefined) this.cooldownOutlet = s.cooldownOutlet;
        if (s.cooldownSecs !== undefined && Number.isFinite(s.cooldownSecs)) this.cooldownSecs = s.cooldownSecs;
        if (s.outletsOnOverview !== undefined) this.outletsOnOverview = s.outletsOnOverview;
        if (s.outletQuickOverview !== undefined) this.outletQuickOverview = s.outletQuickOverview;
        if (s.hideEnergyTile !== undefined) this.hideEnergyTile = s.hideEnergyTile;
        if (s.tempSource !== undefined) this.tempSource = s.tempSource;
        if (s.extTemp !== undefined) this.extTemp = s.extTemp;
        if (s.extHumi !== undefined) this.extHumi = s.extHumi;
        if (s.smart !== undefined) this.smart = s.smart;
        this._colorSynced = true;
        this.cacheColors();
      }
      // Outlet names live under their own dynamic keys — adopt independently of
      // the colour options (a panel may have names but no colour prefs).
      const names = this.serverOutletNames();
      if (Object.keys(names).length) this.outletNames = names;
      const ldirs = this.serverOutletLightDirs();
      if (Object.keys(ldirs).length) this.outletLightDir = ldirs;
    }
    // Switching tabs abandons any unsaved edits on the tab you're leaving, so an
    // un-applied change never lingers with the Apply bar still waiting when you
    // come back (Settings colour draft, env/calibration inputs, alerts edits).
    if (changed.has("tab")) {
      if (this.colorDraft !== null) this.colorDraft = null;
      if (this.alertsDraft !== null) this.alertsDraft = null;
      // Leaving the Environment tab clears any manual sub-view pick, so it
      // re-defaults to the plan view next time a plan is active.
      if (this.envSubView !== null) this.envSubView = null;
      if (this.planDraft !== null) this.planDraft = null;
      if (this.planEditStage !== null) this.planEditStage = null;
      if (this.planShowAll) this.planShowAll = false;
      if (this.planDelArm) this.planDelArm = false;
      if (Object.keys(this.draft).length) this.draft = {};
      if (Object.keys(this.outletDraft).length) this.outletDraft = {};
      if (Object.keys(this.outletNameDraft).length) this.outletNameDraft = {};
      if (Object.keys(this.outletCfgDraft).length) this.outletCfgDraft = {};
      if (Object.keys(this.modePick).length) this.modePick = {};
    }
    if (changed.has("hass")) this.recordHistory();   // for the trend arrows
    if (changed.has("hass") && Object.keys(this.modePick).length) {
      let next: Record<string, string> | null = null;
      for (const [id, val] of Object.entries(this.modePick)) {
        // Drop the optimistic pick ONLY once the entity confirms it (its real
        // state now matches what the user picked). There is deliberately no
        // timeout / auto-revert: if the device is slow or rejects the change
        // the pick stays put until the user hits Discard or leaves the tab.
        // (Auto-revert removed v0.20.19 — the integration now keeps the mode
        // selects synced to the controller, so a confirm always arrives.)
        if (this.get(id)?.state === val) {
          next = next ?? { ...this.modePick };
          delete next[id];
        }
      }
      if (next) this.modePick = next;
    }
    // Confirm optimistic device on/off: once the live state matches the target the
    // user asked for, drop the pending so later external changes flow through. The
    // 8s timeout in markDevPend is the backstop if the change is slow or rejected.
    if (changed.has("hass") && Object.keys(this._devPend).length) {
      let next: Record<string, { on: boolean; until: number }> | null = null;
      for (const [suffix, pend] of Object.entries(this._devPend)) {
        const live = this.deviceLiveOn(suffix);
        if (live !== null && live === pend.on) {
          next = next ?? { ...this._devPend };
          delete next[suffix];
        }
      }
      if (next) this._devPend = next;
    }
    // Confirm optimistic level (speed/brightness): drop once the device reports the applied
    // value (±1) or after the 8s backstop, so later external changes flow through.
    if (changed.has("hass") && Object.keys(this._pendLevel).length) {
      let nl: Record<string, { pct: number; until: number }> | null = null;
      const nowL = Date.now();
      for (const [id, pl] of Object.entries(this._pendLevel)) {
        const live = this.liveLevelPct(id);
        if (nowL > pl.until || (live >= 0 && Math.abs(live - pl.pct) <= 1)) {
          nl = nl ?? { ...this._pendLevel };
          delete nl[id];
        }
      }
      if (nl) this._pendLevel = nl;
    }
    // Same confirm step for optimistic outlet on/off (keyed by switch entity id).
    if (changed.has("hass") && Object.keys(this._outPend).length) {
      let next: Record<string, { on: boolean; until: number }> | null = null;
      for (const [id, pend] of Object.entries(this._outPend)) {
        const e = this.get(id);
        if (e && (e.state === "on") === pend.on) {
          next = next ?? { ...this._outPend };
          delete next[id];
        }
      }
      if (next) this._outPend = next;
    }
  }

  // Air temp/humidity sensor self-clean (the SF app's "Sensor cleaning"): while
  // it runs the controller stops reporting air temp/humi/vpd, so those tiles get
  // a brush badge and show "--" instead of a stale value.
  private cleaningActive(): boolean {
    const c = this.get(`binary_sensor.sf_${this.config.panel}_sensor_cleaning`);
    return !!c && c.state === "on";
  }
  private cleaningRemaining(): string {
    const r = this.get(`sensor.sf_${this.config.panel}_sensor_cleaning_time`);
    const s = r ? parseInt(r.state, 10) : NaN;
    if (!Number.isFinite(s) || s <= 0) return "";
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60);
    return h ? `${h}h ${m}m` : `${m}m`;
  }
  // phase 2 = the 5-minute cooldown after the heat cycle.
  private cleaningCooling(): boolean {
    return this.get(`sensor.sf_${this.config.panel}_sensor_cleaning_phase`)?.state === "2";
  }
  private cleaningLabel(): string {
    return this.cleaningCooling() ? "Cooling" : "Cleaning";
  }
  private setCleaning(on: boolean) {
    this.hass?.callService("sf", "set_sensor_heating", {
      entity_id: `binary_sensor.sf_${this.config.panel}_sensor_cleaning`,
      on,
    });
  }
  // Calibration-tab section: start/stop the air temp/humidity sensor self-clean.
  private renderSensorCleaning() {
    const c = this.get(`binary_sensor.sf_${this.config.panel}_sensor_cleaning`);
    if (!c) return nothing;
    const active = c.state === "on";
    const cooling = this.cleaningCooling();
    const rem = this.cleaningRemaining();
    const acc = this.accent();
    const word = !active ? "Not cleaning" : cooling ? "Cooling sensor…" : "Cleaning sensor…";
    const icon = active && cooling ? "mdi:thermometer-chevron-down" : "mdi:broom";
    const btn = "flex:1;border-radius:8px;padding:9px;font-size:13px;font-weight:500;";
    return html`
      <div class="section-label">Sensor Cleaning</div>
      <div style="font-size:12px;color:var(--secondary-text-color);line-height:1.5;margin:0 0 10px;">
        Runs a self-clean heat cycle on the air temp/humidity probe (~2&nbsp;hours). The
        probe's device turns off during it, then a 5-minute cooldown follows — Air Temp,
        Humidity and VPD pause until it finishes.
      </div>
      <div style="display:flex;align-items:center;gap:8px;background:var(--secondary-background-color);border-radius:8px;padding:9px 11px;margin-bottom:10px;">
        <ha-icon icon=${icon}
          style="color:${active ? acc : "var(--secondary-text-color)"}"></ha-icon>
        <span style="font-size:13px;">${word}</span>
        <span style="margin-left:auto;font-size:13px;font-weight:500;color:${acc};">${
          active && rem ? rem + " left" : ""}</span>
      </div>
      <div style="display:flex;gap:10px;">
        <button ?disabled=${active} @click=${() => this.setCleaning(true)}
          style="${btn}border:none;cursor:${active ? "not-allowed" : "pointer"};opacity:${active ? ".45" : "1"};background:${acc};color:#fff;">Start cleaning</button>
        <button ?disabled=${!active} @click=${() => this.setCleaning(false)}
          style="${btn}background:transparent;cursor:${active ? "pointer" : "not-allowed"};opacity:${active ? "1" : ".45"};color:${acc};border:1px solid ${acc};">Stop cleaning</button>
      </div>`;
  }

  private renderParam([suffix, label, icon]: [string, string, string]) {
    if (suffix === "leaf_vpd" && !this.showLeafVpd) return nothing;
    const e = this.get(`sensor.sf_${this.config.panel}_${suffix}`);
    if (!e) return nothing;
    const unit = e.attributes.unit_of_measurement || "";
    // A soil-average tile whose entity is unavailable means a probe on this
    // controller is offline — always flag it red (independent of the colour
    // mode; it's a fault, not an alarm threshold). Use the short word "Offline"
    // so the value doesn't widen the tile past its grid column.
    const offline = suffix.startsWith("soil_avg_") && isOffline(e);
    const cleaning = ["temperature", "humidity", "vpd", "leaf_vpd"].includes(suffix)
      && this.cleaningActive();
    const val = cleaning
      ? "--"
      : offline
      ? "Offline"
      : this.hass?.formatEntityState
      ? this.hass.formatEntityState(e).replace(unit, "").trim()
      : e.state;
    // The three soil averages expand to a per-probe breakdown on click.
    const metric = suffix.startsWith("soil_avg_")
      ? (suffix.slice("soil_avg_".length) as "temperature" | "moisture" | "ec")
      : null;
    // Only worth expanding when there's more than one probe — with a single
    // probe the "average" already is that probe's value.
    const expandable = !!metric && this.soilProbeRows(metric).length > 1;
    const open = expandable && this.soilOpen === metric;
    // Tile highlight source: alarms (device thresholds), targets (band/target ±
    // dead zone), or both (alarm wins, else target). Leaf VPD has no device
    // alarm, so it always colours against its own min/max band.
    let rc: ReturnType<typeof this.readingColor>;
    const graphOpen = this.paramOpen === suffix;
    if (offline || cleaning) {
      rc = null;
    } else {
      const v = parseFloat(e.state);
      if (!Number.isFinite(v)) {
        rc = null;
      } else {
        const alarmOor = this.colorSource !== "targets"
          ? this.outOfRange(PARAM_ALARM[suffix], v) : null;
        const useTarget = this.colorSource !== "alarms" || suffix === "leaf_vpd";
        const targetOor = useTarget ? this.targetOutOfRange(suffix, v) : null;
        rc = this.colorForOor(alarmOor ?? targetOor);
      }
    }
    // Non-soil tiles open an inline history graph on tap.
    const graphable = !offline && !expandable;
    const sgOpen = !!metric && this.soilGraphOpen === metric;
    let tileStyle = (open || graphOpen || sgOpen) ? `box-shadow:inset 0 0 0 1px ${this.accent()}` : "";
    let valStyle = "";
    if (offline) {
      tileStyle = `background:${ALARM_HI_BG};box-shadow:inset 0 0 0 1px ${ALARM_HI}`;
      valStyle = `color:${ALARM_HI}`;
    } else if (rc && rc.mode === "text") {
      valStyle = `color:${rc.color}`;
    } else if (rc && rc.mode === "tile") {
      tileStyle = `background:${tint(rc.color)};box-shadow:inset 0 0 0 1px ${rc.color}`;
    }
    const clickable = expandable || graphable;
    return html`
      <div class="tile ${clickable ? "clickable" : ""} ${open || graphOpen || sgOpen ? "active" : ""}"
        style=${tileStyle || nothing}
        role=${clickable ? "button" : nothing}
        @click=${expandable
          ? () => (this.soilOpen = open ? null : metric)
          : graphable
          ? () => this.toggleGraph(suffix)
          : undefined}>
        <div class="tile-label">
          <span class="tl-name">${label}</span>
          <span class="tl-right">
            ${cleaning ? html`<ha-icon icon="mdi:broom" title="Sensor cleaning"
              style="--mdc-icon-size:15px;color:var(--warning-color,#ff9800)"></ha-icon>` : nothing}
            ${this.trendIcon(suffix)}
            ${expandable && metric
              ? html`<ha-icon class="tile-more soil-graph-btn"
                  icon="mdi:chart-line" title="History graph"
                  role="button" aria-label="History graph"
                  style=${this.soilGraphOpen === metric ? `color:${this.accent()}` : nothing}
                  @click=${(ev: Event) => { ev.stopPropagation(); this.toggleSoilGraph(metric); }}></ha-icon>`
              : nothing}
            ${expandable
              ? html`<ha-icon class="tile-more"
                  icon=${open ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>`
              : graphable
              ? html`<ha-icon class="tile-more"
                  icon=${graphOpen ? "mdi:chevron-up" : "mdi:chart-line"}></ha-icon>`
              : nothing}
          </span>
        </div>
        <ha-icon icon="${icon}" style="color:${this.accent()}"></ha-icon>
        <div class="tile-val" style=${valStyle || nothing}>${val}${
          offline || cleaning ? nothing : html`<span class="unit">${unit}</span>`}</div>
        ${cleaning
          ? html`<div class="tile-target" style="color:var(--warning-color,#ff9800)">${this.cleaningLabel()}${
              this.cleaningRemaining() ? " · " + this.cleaningRemaining() : ""}</div>`
          : offline ? nothing : this.targetSubline(suffix, unit)}
        ${!offline && !cleaning && suffix === "ppfd" ? this.ppfdPlanTargetSub() : nothing}
        ${offline || cleaning ? nothing : this.renderBand(suffix, parseFloat(e.state))}
      </div>`;
  }

  // Per-probe soil sensors for one metric, sorted by probe number.
  private soilProbeRows(
    metric: "temperature" | "moisture" | "ec"
  ): { name: string; eid: string; e: HassEntity }[] {
    const re = new RegExp(`^sf_${this.config.panel}_(soil\\d+)_${metric}$`);
    const rows: { slot: string; name: string; eid: string; e: HassEntity }[] = [];
    for (const eid of Object.keys(this.hass?.states ?? {})) {
      const m = objectId(eid).match(re);
      if (m) rows.push({
        slot: m[1],
        name: this.soilSensorName(eid, metric),
        eid,
        e: this.hass!.states[eid],
      });
    }
    rows.sort(
      (a, b) => Number(a.slot.replace(/\D/g, "")) - Number(b.slot.replace(/\D/g, ""))
    );
    return rows.map(({ name, eid, e }) => ({ name, eid, e }));
  }

  // Probe display name from a soil sensor: strip the device-name prefix
  // (has_entity_name) and the trailing metric word -> "Front Left" / "Soil 1".
  private soilSensorName(eid: string, metric: string): string {
    let fn = (this.hass?.states[eid]?.attributes.friendly_name as string) ?? "";
    const dev = slotDeviceName(this.hass, this.config.panel);
    if (dev && fn.startsWith(dev)) fn = fn.slice(dev.length).trim();
    const word = metric === "temperature" ? "Temperature"
      : metric === "moisture" ? "Moisture" : "EC";
    fn = fn.replace(new RegExp(`\\s*${word}\\s*$`, "i"), "").trim();
    return fn || objectId(eid);
  }

  private renderSoilPop() {
    const metric = this.soilOpen;
    if (!metric) return nothing;
    const rows = this.soilProbeRows(metric);
    if (!rows.length) return nothing;
    // Same short label + "· By Probe" wording/casing as the multi-line graph
    // header, so the breakdown and the graph read identically. (v0.21.74)
    return html`
      <div class="soil-pop">
        <div class="soil-pop-head sph-tc">
          <span>${this.soilMetricLabel(metric)} · By Probe</span>
          <ha-icon icon="mdi:close" role="button" aria-label="Close"
            @click=${() => (this.soilOpen = null)}></ha-icon>
        </div>
        ${rows.map(({ name, e }) => {
          const off = isOffline(e);
          const unit = e.attributes.unit_of_measurement || "";
          const val = this.hass?.formatEntityState
            ? this.hass.formatEntityState(e).replace(unit, "").trim()
            : e.state;
          const key = metric === "temperature" ? "tempSoil"
            : metric === "moisture" ? "humiSoil" : "ECSoil";
          const rc = off ? null : this.readingColor(key, e.state);
          return html`
            <div class="soil-pop-row ${off ? "offline" : ""}">
              <span class="spn">${name}</span>
              <span class="spv" style=${rc ? `color:${rc.color}` : nothing}>${off
                ? html`Offline`
                : html`${val}<span class="unit">${unit}</span>`}</span>
            </div>`;
        })}
      </div>`;
  }

  // Every soil probe on this panel (union across metrics), sorted by number.
  private soilProbeSlots(): string[] {
    const re = new RegExp(
      `^sf_${this.config.panel}_(soil\\d+)_(temperature|moisture|ec)$`
    );
    const slots = new Set<string>();
    for (const eid of Object.keys(this.hass?.states ?? {})) {
      const m = objectId(eid).match(re);
      if (m) slots.add(m[1]);
    }
    return [...slots].sort(
      (a, b) => Number(a.replace(/\D/g, "")) - Number(b.replace(/\D/g, ""))
    );
  }

  // A probe is offline when its (shared-fate) entities are unavailable.
  private probeOffline(slot: string): boolean {
    const e = this.get(`sensor.sf_${this.config.panel}_${slot}_temperature`)
      ?? this.get(`sensor.sf_${this.config.panel}_${slot}_moisture`)
      ?? this.get(`sensor.sf_${this.config.panel}_${slot}_ec`);
    return isOffline(e);
  }

  private soilCellValue(slot: string, metric: string): string {
    const e = this.get(`sensor.sf_${this.config.panel}_${slot}_${metric}`);
    if (!e || e.state === "unknown" || e.state === "unavailable") return "—";
    return this.hass?.formatEntityState
      ? this.hass.formatEntityState(e)
      : `${e.state}${e.attributes.unit_of_measurement ?? ""}`;
  }

  private probeNameForSlot(slot: string): string {
    for (const metric of ["temperature", "moisture", "ec"]) {
      const eid = `sensor.sf_${this.config.panel}_${slot}_${metric}`;
      if (this.hass?.states[eid]) return this.soilSensorName(eid, metric);
    }
    return slot.replace(/^soil(\d+)$/, "Soil $1");
  }

  // Collapsible "All Soil Sensors Stats" table — only for 2+ probes.
  // "All Soil Stats" as a grid tile (v0.17.13): clicking it expands the
  // combined per-probe table below the grid. The tile turns red when one or
  // more probes are offline. Only shown with 2+ probes.
  private soilStatsTile() {
    const slots = this.soilProbeSlots();
    if (slots.length < 2) return nothing;
    const open = this.soilAllOpen;
    const accent = this.accent();
    const offline = slots.filter((s) => this.probeOffline(s)).length;
    const tileStyle = offline
      ? `background:${ALARM_HI_BG};box-shadow:inset 0 0 0 1px ${ALARM_HI}`
      : (open ? `box-shadow:inset 0 0 0 1px ${accent}` : "");
    const valText = offline
      ? `${offline} offline`
      : `${slots.length} probes`;
    return html`
      <div class="tile clickable ${open ? "active" : ""}" style=${tileStyle || nothing}
        role="button" aria-expanded=${open ? "true" : "false"}
        @click=${() => (this.soilAllOpen = !open)}>
        <div class="tile-label">All Soil Stats
          <ha-icon class="tile-more"
            icon=${open ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
        </div>
        <ha-icon icon="mdi:sprout" style="color:${offline ? ALARM_HI : accent}"></ha-icon>
        <div class="tile-val" style=${offline ? `color:${ALARM_HI}` : nothing}>${valText}</div>
      </div>`;
  }

  private renderSoilAllTable() {
    const slots = this.soilProbeSlots();
    if (slots.length < 2 || !this.soilAllOpen) return nothing;
    return html`
      <div class="soil-all">
        <div class="soil-all-row soil-all-hd">
          <span class="sa-name">Probe</span>
          <span class="sa-v">Temp</span>
          <span class="sa-v">WC</span>
          <span class="sa-v">EC</span>
        </div>
        ${slots.map(
          (slot) => html`
            <div class="soil-all-row ${this.probeOffline(slot) ? "offline" : ""}">
              <span class="sa-name">${this.probeNameForSlot(slot)}</span>
              <span class="sa-v" style=${this.soilCellStyle(slot, "temperature") || nothing}>${this.soilCellValue(slot, "temperature")}</span>
              <span class="sa-v" style=${this.soilCellStyle(slot, "moisture") || nothing}>${this.soilCellValue(slot, "moisture")}</span>
              <span class="sa-v" style=${this.soilCellStyle(slot, "ec") || nothing}>${this.soilCellValue(slot, "ec")}</span>
            </div>`
        )}
      </div>`;
  }

  // ── Overview device tiles ────────────────────────────────────────────────
  // Every present device as a tile descriptor. `domain` is the HA domain of the
  // primary entity (light/fan/switch); `suffix` is the entity suffix.
  private overviewDevices(): {
    domain: string; suffix: string; id: string; label: string; icon: string;
  }[] {
    const out: {
      domain: string; suffix: string; id: string; label: string; icon: string;
    }[] = [];
    const add = (domain: string, list: [string, string, string][]) => {
      for (const [suffix, label, icon] of list) {
        const id = this.eid(domain, suffix);
        if (this.get(id)) out.push({ domain, suffix, id, label, icon });
      }
    };
    add("light", LIGHTS);
    add("fan", FANS);
    add("switch", CLIMATE);
    // Hide a phantom Light 2 (e.g. an inline adapter reported as a light) when
    // the Settings toggle is on.
    return this.hideLight2 ? out.filter((d) => d.suffix !== "light_2") : out;
  }

  private deviceStateText(
    d: { domain: string; suffix: string }, e: HassEntity
  ): string {
    if (e.state === "unavailable" || e.state === "unknown") return "Offline";
    if (d.domain === "light") {
      if (e.state !== "on") return "Off";
      return `${Math.round(((e.attributes.brightness ?? 0) / 255) * 100)}%`;
    }
    if (d.domain === "fan") {
      if (e.state !== "on") return "Off";
      const pct = Math.round(e.attributes.percentage ?? 0);
      return pct ? `${pct}%` : "On";
    }
    // Climate accessory (heater / humidifier / dehumidifier): show the running
    // level while on — heater/humidifier as L1-L10 / L1-L4, dehumidifier Low/High.
    if (e.state !== "on") return "Off";
    const p = this.config.panel;
    if (d.suffix === "dehumidifier") {
      const lv = this.get(`sensor.sf_${p}_dehumidifier_level`)?.state;
      return lv && lv !== "Off" && lv !== "unknown" ? lv : "On";
    }
    if (d.suffix === "heater" || d.suffix === "humidifier") {
      const lv = this.get(`sensor.sf_${p}_${d.suffix}_level`)?.state;
      return lv && lv !== "0" && lv !== "unknown" ? `L${lv}` : "On";
    }
    return "On";
  }

  // Live per-device fault (out of water / tank full / heater alarm) reported in
  // the controller's status frames. Returns a short label or null.
  private deviceFault(suffix: string): string | null {
    const p = this.config.panel;
    const st = (s: string) => this.get(`sensor.sf_${p}_${s}`)?.state;
    if (suffix === "humidifier" && st("humidifier_tank") === "Empty") return "EMPTY";
    if (suffix === "dehumidifier" && st("dehumidifier_tank") === "Full") return "FULL";
    if (suffix === "heater" && st("heater_status") === "Alarm") return "Alarm";
    return null;
  }

  // Dehumidifier compressor cooldown (v0.21.35): the physical unit enforces a
  // ~3-min lockout from the moment it turns OFF before it can run again — even if
  // SF or the integration commands it on. We derive "seconds remaining" from how
  // long the accessory has been off (its state's last_changed), so it's accurate
  // even if the dashboard was opened partway through. "waiting" = the lockout is
  // active AND dehumidification is currently demanded (RH above the humidity
  // target), i.e. it WANTS to run but can't yet.
  // The active (day/night) humidity target for the panel — used to tell whether
  // dehumidification is currently DEMANDED (RH above target => it wants to run).
  // Day/night from the strip's env day-cycle window (HH:MM), matching the
  // integration's own _env_is_day. Used when there's no is_day sensor entity
  // (e.g. an external-sensor strip), so day/night is still resolved correctly.
  private envIsDay(prefix: string): boolean {
    const mins = (id: string, dflt: number) => {
      const m = /^(\d{1,2}):(\d{2})/.exec(this.get(id)?.state || "");
      return m ? (+m[1]) * 60 + (+m[2]) : dflt;
    };
    const start = mins(`text.sf_${prefix}_env_day_start`, 5 * 60);
    const end = mins(`text.sf_${prefix}_env_day_end`, 20 * 60);
    const d = new Date();
    const cur = d.getHours() * 60 + d.getMinutes();
    return start <= end ? (cur >= start && cur < end) : (cur >= start || cur < end);
  }
  private humiTarget(prefix: string = this.config.panel!): number {
    const day = Number(this.get(`number.sf_${prefix}_env_humi_day`)?.state);
    const night = Number(this.get(`number.sf_${prefix}_env_humi_night`)?.state);
    const bin = this.get(`binary_sensor.sf_${prefix}_is_day`)?.state;
    const env = this.get(`sensor.sf_${prefix}_is_day_env_target`)?.state;
    // Prefer an explicit is_day entity; otherwise fall back to the day window so
    // strips without one don't wrongly default to the night target.
    const isDay = (bin === "on" || env === "1") ? true
      : (bin === "off" || env === "0") ? false
      : this.envIsDay(prefix);
    return isDay ? (Number.isFinite(day) ? day : night)
                 : (Number.isFinite(night) ? night : day);
  }
  // Humidity deadband for a strip (0 if unset).
  private humiDeadband(prefix: string): number {
    const dz = Number(this.get(`number.sf_${prefix}_env_humi_deadband`)?.state);
    return Number.isFinite(dz) ? dz : 0;
  }
  // Core cooldown compute from a switch entity's last-off time. `demand` = it
  // currently wants to run but is locked out. Uses the configurable duration.
  private cooldownFrom(activeId: string, demand: boolean):
    { remaining: number; waiting: boolean } | null {
    const e = this.get(activeId);
    if (!e) return null;
    // The compressor lockout runs for `cooldownSecs` from the moment the unit turned
    // OFF and CANNOT be bypassed by a command — so it stays active even if the
    // switch/op-log flips back "on" during the window (the op log logs the request
    // before the compressor can actually run). Base the countdown on the witnessed
    // on->off time REGARDLESS of the current switch state, so the pill keeps counting
    // (and the tile stays off) until the unit can really run. (v0.21.80)
    // Fallback when we didn't witness the off (dashboard opened mid-lockout): the
    // entity's last_changed, but ONLY while it's OFF and a lockout is demanded — a
    // reboot resets last_changed and would otherwise show a phantom cooldown.
    const witnessed = this._cdOffAt[activeId];
    const baseMs = witnessed != null ? witnessed
      : (demand && e.state === "off" && e.last_changed ? Date.parse(e.last_changed) : null);
    if (baseMs == null) return null;
    const offFor = (Date.now() - baseMs) / 1000;
    const remaining = Math.ceil(this.cooldownSecs - offFor);
    if (remaining <= 0) return null;
    return { remaining, waiting: demand };
  }
  // Switches whose off->on lockout the card tracks: the panel dehumidifier plus
  // any outlet running as a dehumidifier. Used to record real transitions.
  private cooldownSwitchIds(): string[] {
    const ids: string[] = [];
    const p = this.config.panel;
    if (this.get(`switch.sf_${p}_dehumidifier`)) ids.push(`switch.sf_${p}_dehumidifier`);
    for (const sl of this.outletSlots()) {
      for (const n of this.outletNums(sl)) {
        const mode = this.get(`select.sf_${sl}_outlet_${n}_mode`)?.state;
        const dir = this.get(`select.sf_${sl}_outlet_${n}_humidity_device`)?.state;
        if (mode === "Humidity" && dir === "Dehumidifying")
          ids.push(`switch.sf_${sl}_outlet_${n}`);
      }
    }
    return ids;
  }
  // Record on->off (start the lockout) and clear it on ->on, from states the card
  // observes live. Called each render before the cooldown pills are evaluated.
  private trackCooldownTransitions(): void {
    for (const id of this.cooldownSwitchIds()) {
      const s = this.get(id)?.state;
      if (s == null) continue;
      const prev = this._cdLastState[id];
      if (prev === s) continue;
      // Start the lockout on an on->off. Do NOT clear it on ->on: the physical
      // compressor lockout runs its full duration from the OFF moment even if the
      // op log flips the switch back on during it. cooldownFrom() returns null once
      // it has elapsed, so a stale off-time is harmless. (v0.21.80)
      if (s === "off" && prev === "on") this._cdOffAt[id] = Date.now();
      this._cdLastState[id] = s;
    }
  }
  // Device-tile dehumidifier cooldown (gated by settings).
  private dehumCooldown(suffix: string):
    { remaining: number; waiting: boolean } | null {
    if (suffix !== "dehumidifier" || !this.cooldownShow || !this.cooldownDevice) return null;
    const p = this.config.panel!;
    const rh = Number(this.get(`sensor.sf_${p}_humidity`)?.state);
    const tgt = this.humiTarget();
    // "Demanded" means it wants to RUN — i.e. RH is above the turn-on point
    // (target + deadband), not merely above target. In the deadband/hysteresis
    // zone it's off and not requested, so the pill reads "Cooldown", not "Starts in".
    const demand = Number.isFinite(rh) && Number.isFinite(tgt) && rh > tgt + this.humiDeadband(p);
    return this.cooldownFrom(`switch.sf_${p}_dehumidifier`, demand);
  }
  // Outlet-tile cooldown — only for an outlet running as a dehumidifier.
  private outletCooldown(slot: string, n: number):
    { remaining: number; waiting: boolean } | null {
    if (!this.cooldownShow || !this.cooldownOutlet) return null;
    const dir = this.get(`select.sf_${slot}_outlet_${n}_humidity_device`)?.state;
    const mode = this.get(`select.sf_${slot}_outlet_${n}_mode`)?.state;
    if (mode !== "Humidity" || dir !== "Dehumidifying") return null;
    const rh = Number(this.get(`sensor.sf_${slot}_humidity`)?.state);
    const tgt = this.humiTarget(slot);
    const demand = Number.isFinite(rh) && Number.isFinite(tgt) && rh > tgt + this.humiDeadband(slot);
    return this.cooldownFrom(`switch.sf_${slot}_outlet_${n}`, demand);
  }
  // True when this card actually controls a dehumidifier — a dehumidifier device
  // (on the panel or a nested strip) or an outlet running Humidity/Dehumidifying.
  // Gates the "Dehumidifier cooldown timer" settings section so it appears only
  // where it's meaningful (not on a plain panel, nor a strip with no dehumidifying
  // outlets).
  private hasDehumidifier(): boolean {
    if (this.get(`switch.sf_${this.config.panel}_dehumidifier`)) return true;
    for (const sl of this.outletSlots()) {
      if (this.get(`switch.sf_${sl}_dehumidifier`)) return true;
      for (const n of this.outletNums(sl)) {
        const mode = this.get(`select.sf_${sl}_outlet_${n}_mode`)?.state;
        const dir = this.get(`select.sf_${sl}_outlet_${n}_humidity_device`)?.state
          || this.dirPick[`${sl}_${n}`];
        if (mode === "Humidity" && dir === "Dehumidifying") return true;
      }
    }
    return false;
  }
  private anyCooldownActive(): boolean {
    if (!this.cooldownShow) return false;
    if (this.cooldownDevice && this.dehumCooldown("dehumidifier")) return true;
    if (this.cooldownOutlet) {
      for (const sl of this.outletSlots())
        for (const n of this.outletNums(sl))
          if (this.outletCooldown(sl, n)) return true;
    }
    return false;
  }
  private fmtMMSS(s: number): string {
    s = Math.max(0, Math.round(s));
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  }
  private cooldownPill(cd: { remaining: number; waiting: boolean } | null, cls = "") {
    if (!cd) return nothing;
    const pct = Math.max(0, Math.min(100, (cd.remaining / this.cooldownSecs) * 100));
    const warn = "var(--warning-color,#ff9800)";
    return html`
      <div class="cd-pill ${cls}" title="Compressor lockout after turning off — it can't restart until this reaches 0:00">
        <span class="cd-txt" style="color:${warn}">
          <ha-icon icon="mdi:timer-sand" style="--mdc-icon-size:14px"></ha-icon>
          ${cd.waiting ? "Starts in" : "Cooldown"} ${this.fmtMMSS(cd.remaining)}
        </span>
        <div class="cd-bar"><div class="cd-fill" style="width:${pct.toFixed(1)}%;background:${warn}"></div></div>
      </div>`;
  }
  private renderCooldownPill(suffix: string) {
    // "cd-device" centres the pill in the tile middle (device tiles pin their
    // icon+value to the bottom, so an in-flow pill would cram at the very bottom);
    // matches where the outlet tile shows its cooldown. (v0.21.66)
    return this.cooldownPill(this.dehumCooldown(suffix), "cd-device");
  }

  // A device's current mode ("Manual" / "Time Slot" / "PPFD" / ...). Lights use
  // the "_mode" select; fan/blower/climate use "_mode_set".
  private deviceMode(d: { domain: string; suffix: string }): string {
    const p = this.config.panel;
    const id = d.domain === "light"
      ? `select.sf_${p}_${d.suffix}_mode`
      : `select.sf_${p}_${d.suffix}_mode_set`;
    return this.get(id) ? this.modeOf(id) : "";
  }
  // The colour for a device's mode group (Settings → Device active color).
  private deviceColorFor(mode: string): string {
    switch (deviceModeGroup(mode)) {
      case "sched": return this.dcSched;
      case "auto": return this.dcAuto;
      default: return this.dcManual;
    }
  }

  private deviceTile(d: {
    domain: string; suffix: string; id: string; label: string; icon: string;
  }) {
    const e = this.get(d.id);
    if (!e) return nothing;
    // Optimistic on/off: while a pending toggle/Apply is in flight, paint the
    // target state so the tile doesn't bounce (and the Manual-mode step of a
    // scheduled quick-off never flashes its colour). Falls back to the live state.
    const pend = this.devPend(d.suffix);
    // Dehumidifier compressor lockout: the op log can flip the switch "on" before the
    // unit can actually run (the ~3-min lockout after it turned off). While that
    // cooldown is active, don't paint the tile "on" — the device is still off. The
    // cooldown pill (rendered below) shows the countdown. (v0.21.80)
    const coolDown = this.dehumCooldown(d.suffix);
    const on = (pend ? pend.on : e.state === "on") && !coolDown;
    // Optimistic-on before the device has actually reported on: the live entity
    // is still off, so deviceStateText() would read "Off" on a lit tile. Show a
    // plain "On" placeholder until the real running state arrives.
    const optimisticOn = !!pend && pend.on && e.state !== "on";
    const key = `${d.domain}:${d.suffix}`;
    const open = this.deviceOpen === key;
    const dgOpen = this.deviceGraphOpen === key;
    const levelS = this.deviceLevelSensor(d.suffix);
    const accent = this.accent();
    // OFFLINE (v0.21.78) — the accessory is truly unreachable, not merely idle
    // "Off". Two sources: the whole controller dropped (its entity goes
    // unavailable/unknown), OR this one accessory reported Offline in the op log
    // (opType 2) while the controller stays online — surfaced as the `offline`
    // attribute by the integration. Guard the attribute with the live on-state so
    // a stale marker can never hide a running device. Shown with the same red
    // attention treatment as an offline soil probe, and it OVERRIDES fault/mode
    // colouring (we can't trust a reading from a device that isn't reporting).
    const offline = isOffline(e) || (e.attributes.offline === true && !on);
    // Fault flag → red tile (like the soil offline highlight; a hardware fault,
    // not the alarm-threshold colouring). Suppressed while offline.
    const fault = !offline && this.deviceFault(d.suffix);
    const attn = offline || !!fault;   // red "attention" state (offline or fault)
    // Active-device colouring by mode (Settings): "off" keeps the accent look;
    // "text" colours the state text + icon; "tile" also tints the tile.
    const mc = !attn && on && this.deviceColorMode !== "off"
      ? this.deviceColorFor(this.deviceMode(d)) : "";
    const fg = attn ? ALARM_HI : (mc || (on ? accent : "var(--secondary-text-color)"));
    let tileStyle = "";
    if (attn) tileStyle = `background:${ALARM_HI_BG};box-shadow:inset 0 0 0 1px ${ALARM_HI}`;
    else if (mc && this.deviceColorMode === "tile")
      tileStyle = `background:${tint(mc)};box-shadow:inset 0 0 0 1px ${mc}`;
    if ((open || dgOpen) && !attn) tileStyle = `box-shadow:inset 0 0 0 1px ${accent}`
      + (mc && this.deviceColorMode === "tile" ? `;background:${tint(mc)}` : "");
    return html`
      <div class="tile tile-device clickable ${open || dgOpen ? "active" : ""}"
        style=${tileStyle || nothing}
        role="button" aria-expanded=${open ? "true" : "false"}
        @click=${() => this.toggleDevice(open ? null : key)}>
        <div class="tile-label"><span class="tl-name">${d.label}</span>
          <span class="tl-right">
            ${levelS ? html`<ha-icon class="tile-more device-graph-btn"
                icon="mdi:chart-line" title="Level history"
                role="button" aria-label="Level history"
                style=${dgOpen ? `color:${accent}` : nothing}
                @click=${(ev: Event) => { ev.stopPropagation(); this.toggleDeviceGraph(key); }}></ha-icon>` : nothing}
            <ha-icon class="tile-more"
              icon=${open ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
          </span>
        </div>
        ${this.tileSummary && !attn ? this.deviceSummaryRow(d) : nothing}
        <ha-icon icon=${d.icon} style="color:${on || attn ? fg : "var(--secondary-text-color)"}"></ha-icon>
        <div class="tile-val" style=${attn ? `color:${ALARM_HI}` : (on ? `color:${fg}` : "")}>
          ${offline ? "Offline" : (fault ?? (on ? (optimisticOn ? "On" : this.deviceStateText(d, e)) : "Off"))}
        </div>
        ${!on && !attn ? this.renderCooldownPill(d.suffix) : nothing}
        ${this.lightDLI(d)}
        ${this.fanBadge(d)}
        ${!on && !attn && this.dlqHas(d.suffix) ? html`<div class="tile-qta" style="color:${accent}"
          title="Quick-toggle profile saved — quick-on restores this device's mode">
          <div class="l1">Quick Toggle</div><div class="l2">Active</div></div>` : nothing}
      </div>`;
  }
  // The light's active on-schedule as [start, stop] "HH:MM". PPFD mode prefers the
  // PPFD schedule, falling back to the Time Slot schedule when the PPFD one is unset
  // — so the schedule line, the LD line, and the DLI all use the same photoperiod.
  private lightSchedule(s: string, mode: string): [string, string] {
    const p = this.config.panel;
    const g = (id: string) => {
      const e = this.get(id);
      return e && e.state !== "unknown" && e.state !== "unavailable" ? e.state : "";
    };
    // While a plan runs the schedule lives in the active plan stage, not the
    // standalone entities (which can hold a stale device-block schedule). Prefer
    // the plan's window so the tile matches the plan overview. (v0.21.61)
    if (mode === "PPFD - Plan") {
      const L = this.planActiveLight(s);
      if (L && L.ppfd_start && L.ppfd_stop) return [L.ppfd_start, L.ppfd_stop];
    }
    let a = g(`text.sf_${p}_${s}_schedule_start`), b = g(`text.sf_${p}_${s}_schedule_stop`);
    if (mode === "PPFD" || mode === "PPFD - Plan") {
      const pa = g(`text.sf_${p}_${s}_ppfd_start`), pb = g(`text.sf_${p}_${s}_ppfd_stop`);
      if (pa && pb && (pa !== "00:00" || pb !== "00:00")) { a = pa; b = pb; }
    }
    return [a, b];
  }
  // PPFD target + Daily Light Integral, stacked in the lower-right of a light tile
  // in PPFD mode. DLI = PPFD target (µmol/m²/s) × on-hours × 0.0036 → mol/m²/day.
  // Uses the PPFD setpoint (no PPFD sensor required); only shown in PPFD mode.
  // The active plan stage's light block (light1/light2) for this panel, or null
  // when no plan is running. While a plan runs the light's real PPFD target and
  // schedule live in the plan, not the standalone entities (which HA leaves
  // 'unknown' for a below-min target), so the tile reads them from here. (v0.21.60)
  private planActiveLight(suffix: string): any | null {
    let info: { active: boolean; stages: any[]; progress: any };
    try { info = this.planInfo(); } catch { return null; }
    if (!info.active || !info.stages.length) return null;
    const sid = info.progress?.stageId;
    const stage = info.stages.find((x: any) => x.stageId === sid) || info.stages[0];
    const key = suffix === "light_2" ? "light2" : "light1";
    return stage && stage[key] && typeof stage[key] === "object" ? stage[key] : null;
  }
  private lightDLI(d: { domain: string; suffix: string }) {
    if (d.domain !== "light") return nothing;
    const p = this.config.panel, s = d.suffix;
    const mode = this.modeOf(`select.sf_${p}_${s}_mode`);
    if (mode !== "PPFD" && mode !== "PPFD - Plan") return nothing;
    let ppfd = Number(this.get(`number.sf_${p}_${s}_ppfd_target`)?.state);
    // While a plan runs the standalone entity may be blank — fall back to the
    // active plan stage's target (floored to the 20 µmol minimum). (v0.21.60)
    if ((!Number.isFinite(ppfd) || ppfd <= 0) && mode === "PPFD - Plan") {
      const L = this.planActiveLight(s);
      if (L) ppfd = Math.max(PPFD_TARGET_MIN, Number(L.ppfd_target) || 0);
    }
    if (!Number.isFinite(ppfd) || ppfd <= 0) return nothing;
    let [a, b] = this.lightSchedule(s, mode);
    if (mode === "PPFD - Plan" && (!/^\d/.test(a) || !/^\d/.test(b))) {
      const L = this.planActiveLight(s);
      if (L && L.ppfd_start && L.ppfd_stop) { a = L.ppfd_start; b = L.ppfd_stop; }
    }
    const am = /^(\d{1,2}):(\d{2})/.exec(a), bm = /^(\d{1,2}):(\d{2})/.exec(b);
    if (!am || !bm) return nothing;
    const hrs = (((+bm[1] * 60 + +bm[2]) - (+am[1] * 60 + +am[2]) + 1440) % 1440) / 60;
    if (hrs <= 0) return nothing;
    const dli = ppfd * hrs * 0.0036;
    return html`<div class="tile-dli">
      <div>${Math.round(ppfd)} µmol</div>
      <div class="tile-dli-v">DLI ${dli.toFixed(1)}</div>
    </div>`;
  }
  // Oscillation / natural wind / standby-speed badge in the lower-right of a fan
  // tile. Running speed stays the tile's main value; standby only applies in the
  // auto modes (Time Slot / Environment / Cycle).
  private fanBadge(d: { domain: string; suffix: string }) {
    if (d.suffix !== "fan") return nothing;
    const p = this.config.panel, s = d.suffix;
    const g = (id: string) => {
      const e = this.get(id);
      return e && e.state !== "unknown" && e.state !== "unavailable" ? e.state : "";
    };
    const items: string[] = [];
    const osc = g(`number.sf_${p}_${s}_oscillation`) || g(`sensor.sf_${p}_${s}_oscillation`);
    if (osc && osc !== "0") items.push(`Osc ${osc}`);
    const nw = g(`switch.sf_${p}_${s}_natural_wind`) || g(`binary_sensor.sf_${p}_${s}_natural_wind`);
    if (nw === "on") items.push("Nat Wind");   // shown only when on
    if (this.modeOf(`select.sf_${p}_${s}_mode_set`) !== "Manual") {
      const sb = g(`number.sf_${p}_${s}_standby_speed`);
      // Fan standby is a gear (1-10); show it as a percentage like the main
      // tile value (gear 4 -> 40%), matching how the SF app displays it.
      if (sb) items.push(`Stby ${sb === "0" ? "Off" : Number(sb) * 10 + "%"}`);
    }
    if (!items.length) return nothing;
    return html`<div class="tile-dli">${items.map((t) => html`<div>${t}</div>`)}</div>`;
  }

  // Multi-line mode summary shown right under a device tile's expand arrow (the
  // Settings "Device mode summary" toggle). Kept to 2-3 short, abbreviated lines
  // so the tile stays light; the main on/off/level stays at the bottom. Manual
  // mode adds nothing (the tile already shows the level/state).
  private deviceSummaryRow(d: { domain: string; suffix: string }) {
    const lines = this.deviceSummaryLines(d);
    return lines.length
      ? html`<div class="tile-summary">
          ${lines.map((l) => html`<span>${l}</span>`)}
        </div>`
      : nothing;
  }
  // Format an "HH:MM" clock time for tile display — 24h as-is, or 12h AM/PM
  // ("05:00" -> "5:00am") when the Settings toggle is on.
  private fmtClock(hhmm: string): string {
    if (!this.hour12) return hhmm;
    const m = /^(\d{1,2}):(\d{2})/.exec(hhmm || "");
    if (!m) return hhmm;
    let h = +m[1];
    const ap = h >= 12 ? "pm" : "am";
    h = h % 12 || 12;
    return `${h}:${m[2]}${ap}`;
  }
  private shortDur(v: string): string {
    const m = /^(\d+):(\d{2})(?::(\d{2}))?$/.exec((v || "").trim());
    if (!m) return v || "";
    const h = +m[1], mi = +m[2], sec = +(m[3] ?? 0);
    if (h) return mi ? `${h}h${mi}m` : `${h}h`;
    if (mi) return sec ? `${mi}m${sec}s` : `${mi}m`;
    return `${sec}s`;
  }
  private deviceSummaryLines(d: { domain: string; suffix: string }): string[] {
    const p = this.config.panel;
    const s = d.suffix;
    const st = (id: string) => {
      const e = this.get(id);
      return e && e.state !== "unknown" && e.state !== "unavailable" ? e.state : "";
    };
    // Keyed lower-case so the label is right whatever casing the integration
    // publishes for the run mode ("Temperature only" or "Temperature Only").
    const RUN_ABBR: Record<string, string> = {
      "prioritize temperature": "Pri Temp",
      "prioritize humidity": "Pri Humid",
      "temperature only": "Temperature",
      "humidity only": "Humidity",
      "temperature & humidity": "Temp+Humid",
    };
    const lines: string[] = [];

    if (d.domain === "light") {
      const mode = this.modeOf(`select.sf_${p}_${s}_mode`) || "";
      if (!mode || mode === "unavailable" || mode === "unknown") return [];
      lines.push(mode);   // Manual / Time Slot / PPFD / PPFD - Plan
      // The schedule / photoperiod line only applies to a schedule-driven mode.
      // In Manual the light holds a fixed brightness (or off) and the stored
      // schedule is inactive — showing it read as an active schedule under
      // "Manual" (e.g. left over after a plan stopped). (v0.21.56)
      if (mode !== "Manual") {
        const [a, b] = this.lightSchedule(s, mode);
        if (a && b && (a !== "00:00" || b !== "00:00")) {
          lines.push(`${this.fmtClock(a)}–${this.fmtClock(b)}`);
          const d = this.hrsText(a, b);   // on-duration line, e.g. "LD - 18:00hrs"
          if (d) lines.push(`LD - ${d}`);
        }
      }
      return lines;
    }

    if (s === "blower" || s === "fan") {
      const mode = this.modeOf(`select.sf_${p}_${s}_mode_set`) || "";
      if (!mode || mode === "unavailable" || mode === "unknown") return [];
      if (mode === "Manual") { lines.push("Manual"); return lines; }
      const runId = s === "blower"
        ? `number.sf_${p}_blower_running_speed`
        : `number.sf_${p}_fan_schedule_gear`;
      const fmt = (v: string) => (s === "blower" ? `${v}%` : `L${v}`);
      const runRaw = st(runId);
      const sbRaw = st(`number.sf_${p}_${s}_standby_speed`);
      const runTxt = runRaw === "0" ? "Auto" : runRaw ? fmt(runRaw) : "";
      const sbTxt = sbRaw && sbRaw !== "0" ? fmt(sbRaw) : "Off";
      // Fans show running speed as the tile's main value and standby/oscillation/
      // natural-wind in the lower-right badge, so the summary skips the speed line;
      // the blower (no badge) keeps it.
      const speedLine = (s === "blower" && runTxt) ? `${runTxt} · Stby ${sbTxt}` : "";

      if (mode === "Environment") {
        // Two lines: "Environment" on top, the run mode (e.g. "Temp/Humid")
        // on its own line below.
        const run = this.modeOf(`select.sf_${p}_${s}_run_mode`);
        lines.push("Environment");
        if (run) lines.push(RUN_ABBR[run.toLowerCase()] ?? run);
        if (speedLine) lines.push(speedLine);
      } else if (mode === "Time Slot") {
        lines.push("Time Slot");
        const a = st(`text.sf_${p}_${s}_schedule_start`);
        const b = st(`text.sf_${p}_${s}_schedule_stop`);
        if (a && b) lines.push(`${this.fmtClock(a)}–${this.fmtClock(b)}`);
        if (speedLine) lines.push(speedLine);
      } else if (mode === "Cycle") {
        lines.push("Cycle");
        const r = st(`text.sf_${p}_${s}_cycle_run`);
        const o = st(`text.sf_${p}_${s}_cycle_off`);
        if (r && o) lines.push(`${this.shortDur(r)} on · ${this.shortDur(o)} off`);
        if (speedLine) lines.push(speedLine);
      }
      return lines;
    }

    if (s === "heater" || s === "humidifier" || s === "dehumidifier") {
      const mode = this.modeOf(`select.sf_${p}_${s}_mode_set`) || "";
      if (!mode || mode === "unavailable" || mode === "unknown") return [];
      if (mode === "Manual") { lines.push("Manual"); return lines; }
      if (mode === "Time Slot") {
        lines.push("Time Slot");
        const a = st(`text.sf_${p}_${s}_schedule_start`);
        const b = st(`text.sf_${p}_${s}_schedule_stop`);
        if (a && b) lines.push(`${this.fmtClock(a)}–${this.fmtClock(b)}`);
      } else if (mode === "Cycle") {
        lines.push("Cycle");
        const r = st(`text.sf_${p}_${s}_cycle_run`);
        const o = st(`text.sf_${p}_${s}_cycle_off`);
        if (r && o) lines.push(`${this.shortDur(r)} on · ${this.shortDur(o)} off`);
      } else {
        // Temperature / Humidity here IS the controller's Environment (auto)
        // mode — label it "Environment" on top (matching the fan/blower env
        // display), then the direction + gear below. (v0.21.75)
        lines.push("Environment");
        const modeAbbr = mode;   // "Temperature" / "Humidity" (direction)
        if (s === "humidifier" || s === "heater") {
          // The mode stays auto (Environment); the GEAR is what the unit powers
          // on to — either Automatic, or a fixed level 1-N. Show the direction,
          // then the gear on its own line below: "Auto" (automatic) or
          // "Auto - Lvl N" (fixed gear). The gear reports "unknown" while idle
          // (no config `level` yet) → treat that as Automatic. (v0.21.79)
          const g = st(`select.sf_${p}_${s}_gear`);
          lines.push(modeAbbr);
          lines.push((!g || g === "Automatic") ? "Auto" : `Auto - Lvl ${g}`);
        } else {
          // Dehumidifier gear is Low/High — keep it inline with the direction.
          const gear = st(`select.sf_${p}_dehumidifier_gear`)
            || st(`select.sf_${p}_dehumidifier_level_set`) || "";
          lines.push(gear ? `${modeAbbr} · ${gear}` : modeAbbr);
        }
      }
      return lines;
    }
    return [];
  }

  // Config entities that belong to a device (mode/level/oscillation/etc.),
  // excluding its main power switch and — for fans — the speed number the pop
  // already renders as a slider.
  private relatedControls(suffix: string, domain: string) {
    const p = this.config.panel;
    const re = new RegExp(`^(number|select|switch|text)\\.sf_${p}_${suffix}(_|$)`);
    const mainSwitch = `switch.sf_${p}_${suffix}`;
    // The speed/gear number entity_id is name-slugged (…_fan_speed), so it
    // duplicates the pop's primary Speed slider — drop it for fan devices.
    const speedNum = `number.sf_${p}_${suffix}_speed`;
    const dev = slotDeviceName(this.hass, this.config.panel);
    return Object.keys(this.hass?.states ?? {})
      .filter(
        (id) =>
          re.test(id) &&
          id !== mainSwitch &&
          !(domain === "fan" && id === speedNum)
      )
      .sort()
      .map((id) => {
        // Strip the device-name prefix -> "Fan Oscillation", "Heater Level".
        let label = (this.hass?.states[id]?.attributes.friendly_name as string) ?? "";
        if (dev && label.startsWith(dev)) label = label.slice(dev.length).trim();
        // ctlRow (dev-row style) so these match the Power/Speed rows' font;
        // renderControl used the smaller .ctl-label styling.
        return this.ctlRow(label || id, id);
      });
  }

  // The controls that drop down when a device tile is expanded.
  private renderDevicePop() {
    const key = this.deviceOpen;
    if (!key) return nothing;
    const dev = this.overviewDevices().find((d) => `${d.domain}:${d.suffix}` === key);
    if (!dev) return nothing;
    const e = this.get(dev.id);
    if (!e) return nothing;
    const body =
      dev.domain === "light" ? this.renderLightBody(dev, e)
      : dev.suffix === "fan" ? this.renderFanBody(dev, e)
      : dev.suffix === "blower" ? this.renderBlowerBody(dev, e)
      : dev.suffix === "heater" ? this.renderHeaterBody(dev, e)
      : dev.suffix === "dehumidifier" ? this.renderDehumidifierBody(dev, e)
      : dev.suffix === "humidifier" ? this.renderHumidifierBody(dev, e)
      : this.renderGenericBody(dev, e);
    return html`
      <div class="soil-pop" style="--sf-accent:${this.accent()}">
        <div class="soil-pop-head">
          <span>${dev.label}</span>
          <ha-icon icon="mdi:close" role="button" aria-label="Close"
            @click=${() => this.toggleDevice(null)}></ha-icon>
        </div>
        ${body}
      </div>`;
  }

  // Staged device power. Reads/writes the draft under "power:<entity_id>"; the
  // device's Apply bar commits it via the right service.
  private devOn(id: string, curOn: boolean): boolean {
    const k = `power:${id}`;
    if (k in this.draft) return this.draft[k] === "on";
    // After Apply clears the draft, hold the optimistic target so the pop's power
    // toggle doesn't bounce back to the (briefly stale) live state before the
    // device reports in — same pending the tile uses. (v0.21.66)
    const suffix = id.split(".")[1]?.replace(`sf_${this.config.panel}_`, "");
    const pend = suffix ? this.devPend(suffix) : null;
    return pend ? pend.on : curOn;
  }
  private powerRow(id: string, _svc: string, label: string, on: boolean) {
    const k = `power:${id}`;
    const cur = this.devOn(id, on);
    const accent = this.accent();
    return html`
      <div class="dev-row ${k in this.draft ? "staged" : ""}">
        <span class="dev-lbl">Power</span>
        <span class="dev-spacer"></span>
        <button class="toggle ${cur ? "on" : ""}"
          style=${cur ? `background:${accent}` : ""}
          @click=${() => this.stage(k, cur ? "off" : "on")}
          aria-label="Toggle ${label}"></button>
      </div>`;
  }
  // Apply/Discard bar for a device pop. Commits staged module settings via
  // apply_bundle, plus the staged power / brightness / speed / Manual controls
  // via their own services — all as one action.
  private deviceBar(
    applyId: string, map: Record<string, string>,
    dev: { domain: string; id: string }
  ) {
    const dirty = Object.keys(this.draft).length > 0;
    // Watch the device's own entity so "Saving…" holds until its state actually
    // changes (the toggle physically moves), not a fixed timer.
    return this.saveBar(dirty,
      () => this.deviceApply(applyId, map, dev),
      () => this.discardEdits(), "", dev.id);
  }
  private deviceApply(
    applyId: string, map: Record<string, string>,
    dev: { domain: string; id: string }
  ) {
    // 1. Module settings (mode + schedule/cycle/gear/wind/speed) — one atomic
    //    apply_bundle. Removes committed ids from the draft.
    this.commitBundle(applyId, map);
    // 2. Manual brightness (light) / speed (fan) via their own services.
    const bk = `bri:${dev.id}`, ck = `pct:${dev.id}`, pk = `power:${dev.id}`;
    if (bk in this.draft) this.hass?.callService("light", "turn_on",
      { entity_id: dev.id, brightness_pct: Number(this.draft[bk]) });
    if (ck in this.draft) this.hass?.callService("fan", "set_percentage",
      { entity_id: dev.id, percentage: Number(this.draft[ck]) });
    // 3. Remaining plain-entity edits (Manual gear/wind, oscillation, related).
    for (const id of Object.keys(this.draft)) {
      if (id.includes(":") || id in map) continue;
      const raw = this.draft[id];
      switch (id.split(".")[0]) {
        case "number":
          this.hass?.callService("number", "set_value", { entity_id: id, value: Number(raw) }); break;
        case "select":
          this.hass?.callService("select", "select_option", { entity_id: id, option: raw }); break;
        case "text":
          this.hass?.callService("text", "set_value", { entity_id: id, value: raw }); break;
        case "switch":
          this.hass?.callService("switch", raw === "on" ? "turn_on" : "turn_off", { entity_id: id }); break;
      }
    }
    // 4. Power last, so an explicit off wins over a brightness/speed turn-on.
    //    A staged brightness/speed already turns the device on, so skip a
    //    redundant bare turn-on (which could otherwise reset the level).
    if (pk in this.draft) {
      const on = this.draft[pk] === "on";
      const levelStaged = (dev.domain === "light" && bk in this.draft)
        || (dev.domain === "fan" && ck in this.draft);
      if (!(on && levelStaged)) {
        const svc = dev.domain === "fan" ? "fan" : dev.domain === "light" ? "light" : "switch";
        this.hass?.callService(svc, on ? "turn_on" : "turn_off", { entity_id: dev.id });
      }
    }
    // Paint the applied power state optimistically so the tile doesn't bounce
    // before the device reports in: a power-OFF drops the accessory to Manual and
    // clears mOnOff, which the controller briefly echoes as an enable (mOnOff:1)
    // before the off (would flash on); a power-ON lags a beat before the switch/
    // fan entity flips (would flash off). (v3.19.242 off; v0.21.66 on)
    const poweringOff = this.draft[pk] === "off";
    const poweringOn = this.draft[pk] === "on";
    // Hold the just-applied speed/brightness optimistically so its dropdown/slider shows the
    // new value through the save, not the stale live one. (v0.21.116)
    const _lvK = ck in this.draft ? ck : (bk in this.draft ? bk : null);
    if (_lvK) this._pendLevel = { ...this._pendLevel, [dev.id]: { pct: Number(this.draft[_lvK]), until: Date.now() + 8000 } };
    // 5. Clear staged edits; keep the optimistic mode pick until the device
    //    confirms it (willUpdate drops it then).
    this.draft = {};
    // A manual device change supersedes any remembered quick-toggle profile.
    const suffix = dev.id.split(".")[1]?.replace(`sf_${this.config.panel}_`, "");
    if (suffix) this.dlqClear(suffix);
    if (suffix && poweringOff) this.markDevPend(suffix, false);
    else if (suffix && poweringOn) this.markDevPend(suffix, true);
  }

  private renderGenericBody(
    dev: { domain: string; suffix: string; id: string; label: string; icon: string },
    e: HassEntity
  ) {
    const on = e.state === "on";
    const svc = dev.domain === "fan" ? "fan" : "switch";
    const pct = Math.round(e.attributes.percentage ?? 0);
    const primary = dev.domain === "fan"
      ? this.speedRow(dev, on ? pct : 0, 0, 10) : nothing;   // fan = gears 1-10
    return html`${this.powerRow(dev.id, svc, dev.label, on)}${primary}${this.relatedControls(
      dev.suffix,
      dev.domain
    )}${this.deviceBar(`text.sf_${this.config.panel}_${dev.suffix}_apply`, {}, dev)}`;
  }

  // Staged Manual speed (fan / blower) as a dropdown — writes the draft under
  // "pct:<id>". `levels` > 0 renders gear numbers 1..levels (fans); otherwise a
  // percentage list in 1% steps from `min` (blower). Either way the DRAFT value
  // is the percentage the fan service expects.
  private speedRow(
    dev: { domain: string; id: string }, curPct: number, min = 0, levels = 0
  ) {
    const k = `pct:${dev.id}`;
    const pl = this._pendLevel[dev.id];
    const v = k in this.draft ? Number(this.draft[k])
      : (pl && pl.until > Date.now() ? pl.pct : curPct);
    const options = levels > 0
      ? Array.from({ length: levels }, (_, i) => {
          const lv = i + 1;
          const pct = Math.round((lv / levels) * 100);
          return { value: pct, label: String(lv),
                   sel: Math.round((v / 100) * levels) === lv };
        })
      : (() => {
          const arr: { value: number; label: string; sel: boolean }[] = [];
          if (min <= 0) arr.push({ value: 0, label: "Off", sel: v === 0 });
          for (let p = Math.max(min, 1); p <= 100; p += 1)
            arr.push({ value: p, label: p + "%", sel: p === v });
          return arr;
        })();
    return html`
      <div class="dev-row ${k in this.draft ? "staged" : ""}">
        <span class="dev-lbl">Speed</span>
        <span class="ctl-input">
          <select .value=${live(String((options.find((o) => o.sel) || options[0] || { value: v }).value))} @change=${(ev: Event) =>
            this.stage(k, (ev.target as HTMLSelectElement).value)}>
            ${options.map((o) => html`<option value=${o.value}
              ?selected=${o.sel}>${o.label}</option>`)}
          </select>
        </span>
      </div>`;
  }
  // Staged brightness slider (light) — writes the draft under "bri:<id>".
  private brightnessRow(dev: { id: string }, curPct: number) {
    const k = `bri:${dev.id}`;
    const pl = this._pendLevel[dev.id];
    const v = k in this.draft ? Number(this.draft[k])
      : (pl && pl.until > Date.now() ? pl.pct : curPct);
    const opts: number[] = [];
    for (let p = 11; p <= 100; p += 1) opts.push(p);   // 1% steps, 11–100%
    return html`
      <div class="dev-row ${k in this.draft ? "staged" : ""}">
        <span class="dev-lbl">Brightness</span>
        <span class="ctl-input">
          <select .value=${live(String(v))} @change=${(ev: Event) =>
            this.stage(k, (ev.target as HTMLSelectElement).value)}>
            ${opts.map((p) => html`<option value=${p} ?selected=${p === v}>${
              p + "%"}</option>`)}
          </select>
        </span>
      </div>`;
  }

  // ── Mode-aware Heater tile (Manual / Time Slot / Cycle / Temperature) ─────
  // Manual = Switch + Gear (live). Scheduled modes stage behind Save. Gear is
  // the heater level (L1-L10 == mLevel).
  private renderHeaterBody(
    dev: { domain: string; suffix: string; id: string; label: string; icon: string },
    e: HassEntity
  ) {
    const p = this.config.panel;
    const on = e.state === "on";
    const modeId = `select.sf_${p}_heater_mode_set`;
    const modeE = this.get(modeId);
    const mode = this.modeOf(modeId);
    const gearId = `number.sf_${p}_heater_level`;   // entity id from name "Heater Level"
    const applyId = `text.sf_${p}_heater_apply`;
    const gearOpts = this.numOpts(1, 10, 1, (n) => `L${n}`);

    const rows: unknown[] = [];
    if (modeE) rows.push(this.liveModeRow("Mode", modeId, dev.id));
    // Power toggle only in Manual — the other modes are driven by the mode itself,
    // not the power toggle. (Bugs.txt #4)
    if (mode === "Manual") rows.push(this.powerRow(dev.id, "switch", dev.label, on));

    if (mode === "Manual") {
      rows.push(this.optSelectRow("Gear", gearId, gearOpts));  // staged
      // Gear + power go in ONE apply_bundle (mLevel + mOnOff together) so they
      // don't race as two config writes — which applied the wrong level and could
      // turn the heater on unexpectedly. (Bugs.txt: value + auto-on)
      rows.push(this.deviceBar(applyId,
        { [modeId]: "mode", [gearId]: "gear", [`power:${dev.id}`]: "onoff" }, dev));
    } else if (mode === "Time Slot") {
      const sStart = `text.sf_${p}_heater_schedule_start`;
      const sStop = `text.sf_${p}_heater_schedule_stop`;
      const map: Record<string, string> = {
        [modeId]: "mode", [sStart]: "schedule_start", [sStop]: "schedule_end",
        [gearId]: "gear",
      };
      rows.push(this.stagedPeriodRow(sStart, sStop, "Schedule"));
      rows.push(this.optSelectRow("Gear", gearId, gearOpts));
      rows.push(this.deviceBar(applyId, map, dev));
    } else if (mode === "Cycle") {
      const cStart = `text.sf_${p}_heater_cycle_start`;
      const cRun = `text.sf_${p}_heater_cycle_run`;
      const cOff = `text.sf_${p}_heater_cycle_off`;
      const cTimes = `number.sf_${p}_heater_cycle_times`;
      const map: Record<string, string> = {
        [modeId]: "mode", [cStart]: "cycle_start", [cRun]: "cycle_run",
        [cOff]: "cycle_off", [cTimes]: "cycle_times", [gearId]: "gear",
      };
      rows.push(this.stagedRow("Start Time", cStart, "time"));
      rows.push(this.stagedRow("Run Time", cRun, "duration"));
      rows.push(this.stagedRow("Closing Time", cOff, "duration"));
      rows.push(this.stagedRangeRow("Execution Times", cTimes));
      rows.push(this.optSelectRow("Gear", gearId, gearOpts));
      rows.push(this.deviceBar(applyId, map, dev));
    } else if (mode === "Temperature") {
      // Temperature-mode gear adds "Automatic" (controller picks the level) on
      // top of 1-10; it maps to the device `level` field via heater_gear.
      const gearSel = `select.sf_${p}_heater_gear`;
      const hasSel = !!this.get(gearSel);
      const map: Record<string, string> = hasSel
        ? { [modeId]: "mode", [gearSel]: "auto_gear" }
        : { [modeId]: "mode", [gearId]: "gear" };
      rows.push(hasSel
        ? this.stagedRow("Gear", gearSel)
        : this.optSelectRow("Gear", gearId, gearOpts));
      rows.push(this.infoRow(
        "Automatic follows the day/night temperature targets; 1–10 sets a fixed level", ""));
      rows.push(this.deviceBar(applyId, map, dev));
    }
    return rows;
  }

  // ── Mode-aware Dehumidifier tile (Manual / Time Slot / Cycle / Humidity) ──
  // Wind Speed is Low/High (== mLevel 0/1).
  private renderDehumidifierBody(
    dev: { domain: string; suffix: string; id: string; label: string; icon: string },
    e: HassEntity
  ) {
    const p = this.config.panel;
    const on = e.state === "on";
    const modeId = `select.sf_${p}_dehumidifier_mode_set`;
    const modeE = this.get(modeId);
    const mode = this.modeOf(modeId);
    const windId = `select.sf_${p}_dehumidifier_level`;  // Low/High select (name-derived id)
    const applyId = `text.sf_${p}_dehumidifier_apply`;

    const rows: unknown[] = [];
    if (modeE) rows.push(this.liveModeRow("Mode", modeId, dev.id));
    // Power toggle only in Manual — the other modes are driven by the mode itself,
    // not the power toggle. (Bugs.txt #4)
    if (mode === "Manual") rows.push(this.powerRow(dev.id, "switch", dev.label, on));

    if (mode === "Manual") {
      rows.push(this.ctlRow("Wind Speed", windId));  // staged Low/High
      // Wind (level) + power as ONE apply_bundle so they don't race. (auto-on fix)
      rows.push(this.deviceBar(applyId,
        { [modeId]: "mode", [windId]: "wind", [`power:${dev.id}`]: "onoff" }, dev));
    } else if (mode === "Time Slot") {
      const sStart = `text.sf_${p}_dehumidifier_schedule_start`;
      const sStop = `text.sf_${p}_dehumidifier_schedule_stop`;
      const map: Record<string, string> = {
        [modeId]: "mode", [sStart]: "schedule_start", [sStop]: "schedule_end",
        [windId]: "wind",
      };
      rows.push(this.stagedPeriodRow(sStart, sStop, "Schedule"));
      rows.push(this.stagedRow("Wind Speed", windId));
      rows.push(this.deviceBar(applyId, map, dev));
    } else if (mode === "Cycle") {
      const cStart = `text.sf_${p}_dehumidifier_cycle_start`;
      const cRun = `text.sf_${p}_dehumidifier_cycle_run`;
      const cOff = `text.sf_${p}_dehumidifier_cycle_off`;
      const cTimes = `number.sf_${p}_dehumidifier_cycle_times`;
      const map: Record<string, string> = {
        [modeId]: "mode", [cStart]: "cycle_start", [cRun]: "cycle_run",
        [cOff]: "cycle_off", [cTimes]: "cycle_times", [windId]: "wind",
      };
      rows.push(this.stagedRow("Start Time", cStart, "time"));
      rows.push(this.stagedRow("Run Time", cRun, "duration"));
      rows.push(this.stagedRow("Closing Time", cOff, "duration"));
      rows.push(this.stagedRangeRow("Execution Times", cTimes));
      rows.push(this.stagedRow("Wind Speed", windId));
      rows.push(this.deviceBar(applyId, map, dev));
    } else if (mode === "Humidity") {
      // Humidity mode is the auto behaviour; the gear is a manual Low/High
      // choice stored in the device `level` field (via dehumidifier_gear).
      const gearSel = `select.sf_${p}_dehumidifier_gear`;
      const hasSel = !!this.get(gearSel);
      const map: Record<string, string> = hasSel
        ? { [modeId]: "mode", [gearSel]: "auto_gear" }
        : { [modeId]: "mode", [windId]: "wind" };
      rows.push(this.stagedRow("Wind Speed", hasSel ? gearSel : windId));
      rows.push(this.infoRow(
        "Runs on the tent's day/night humidity targets, at Low or High power", ""));
      rows.push(this.deviceBar(applyId, map, dev));
    }
    return rows;
  }

  // ── Mode-aware Humidifier tile (Manual / Time Slot / Cycle / Humidity) ────
  // Same shape as the heater; Gear is the humidifier level L1-L4 (== mLevel).
  private renderHumidifierBody(
    dev: { domain: string; suffix: string; id: string; label: string; icon: string },
    e: HassEntity
  ) {
    const p = this.config.panel;
    const on = e.state === "on";
    const modeId = `select.sf_${p}_humidifier_mode_set`;
    const modeE = this.get(modeId);
    const mode = this.modeOf(modeId);
    const gearId = `number.sf_${p}_humidifier_level`;  // entity id from name "Humidifier Level"
    const applyId = `text.sf_${p}_humidifier_apply`;
    const gearOpts = this.numOpts(1, 4, 1, (n) => `L${n}`);

    const rows: unknown[] = [];
    if (modeE) rows.push(this.liveModeRow("Mode", modeId, dev.id));
    // Power toggle only in Manual — the other modes are driven by the mode itself,
    // not the power toggle. (Bugs.txt #4)
    if (mode === "Manual") rows.push(this.powerRow(dev.id, "switch", dev.label, on));

    if (mode === "Manual") {
      rows.push(this.optSelectRow("Gear", gearId, gearOpts));  // staged
      // Gear (level) + power in ONE apply_bundle so they don't race. (auto-on fix)
      rows.push(this.deviceBar(applyId,
        { [modeId]: "mode", [gearId]: "gear", [`power:${dev.id}`]: "onoff" }, dev));
    } else if (mode === "Time Slot") {
      const sStart = `text.sf_${p}_humidifier_schedule_start`;
      const sStop = `text.sf_${p}_humidifier_schedule_stop`;
      const map: Record<string, string> = {
        [modeId]: "mode", [sStart]: "schedule_start", [sStop]: "schedule_end",
        [gearId]: "gear",
      };
      rows.push(this.stagedPeriodRow(sStart, sStop, "Schedule"));
      rows.push(this.optSelectRow("Gear", gearId, gearOpts));
      rows.push(this.deviceBar(applyId, map, dev));
    } else if (mode === "Cycle") {
      const cStart = `text.sf_${p}_humidifier_cycle_start`;
      const cRun = `text.sf_${p}_humidifier_cycle_run`;
      const cOff = `text.sf_${p}_humidifier_cycle_off`;
      const cTimes = `number.sf_${p}_humidifier_cycle_times`;
      const map: Record<string, string> = {
        [modeId]: "mode", [cStart]: "cycle_start", [cRun]: "cycle_run",
        [cOff]: "cycle_off", [cTimes]: "cycle_times", [gearId]: "gear",
      };
      rows.push(this.stagedRow("Start Time", cStart, "time"));
      rows.push(this.stagedRow("Run Time", cRun, "duration"));
      rows.push(this.stagedRow("Closing Time", cOff, "duration"));
      rows.push(this.stagedRangeRow("Execution Times", cTimes));
      rows.push(this.optSelectRow("Gear", gearId, gearOpts));
      rows.push(this.deviceBar(applyId, map, dev));
    } else if (mode === "Humidity") {
      // Humidity-mode gear has an extra "Automatic" option (device picks the
      // level from the humidity target) on top of the fixed levels 1-4. It maps
      // to the device `level` field via the humidifier_gear select. Older
      // integrations without that entity fall back to the numeric gear.
      const gearSel = `select.sf_${p}_humidifier_gear`;
      const hasSel = !!this.get(gearSel);
      const map: Record<string, string> = hasSel
        ? { [modeId]: "mode", [gearSel]: "auto_gear" }
        : { [modeId]: "mode", [gearId]: "gear" };
      rows.push(hasSel
        ? this.stagedRow("Gear", gearSel)
        : this.optSelectRow("Gear", gearId, gearOpts));
      rows.push(this.infoRow(
        "Automatic follows the day/night humidity targets; 1–4 sets a fixed level", ""));
      rows.push(this.deviceBar(applyId, map, dev));
    }
    return rows;
  }

  // ── Mode-aware light tile ────────────────────────────────────────────────
  private textState(id: string): string {
    const e = this.get(id);
    if (!e || e.state === "unknown" || e.state === "unavailable") return "";
    return e.state;
  }
  private durMinutes(startId: string, endId: string): number | null {
    const toMin = (s: string) => {
      const m = /^(\d{1,2}):(\d{2})/.exec(s);
      return m ? Number(m[1]) * 60 + Number(m[2]) : null;
    };
    const a = toMin(this.textState(startId));
    const b = toMin(this.textState(endId));
    if (a == null || b == null) return null;
    let d = (b - a + 1440) % 1440;
    if (d === 0) d = 1440; // start == end -> full 24h day
    return d;
  }
  private durationText(startId: string, endId: string): string | null {
    const d = this.durMinutes(startId, endId);
    if (d == null) return null;
    return `${Math.floor(d / 60)}h ${String(d % 60).padStart(2, "0")}min`;
  }
  private infoRow(label: string, value: string) {
    return html`<div class="dev-row">
      <span class="dev-lbl">${label}</span><span class="dev-spacer"></span>
      <span class="dev-val">${value}</span>
    </div>`;
  }
  // Staged device control row (dev-row layout). Writes to the draft; the
  // device's Apply bar commits it.
  private ctlRow(label: string, id: string) {
    const e = this.get(id);
    if (!e) return nothing;
    const control = id.split(".")[0] === "switch"
      ? this.stagedSwitch(id) : this.stagedInput(id);
    return html`<div class="dev-row ${id in this.draft ? "staged" : ""}">
      <span class="dev-lbl">${label}</span>
      <div class="ctl-input">${control}</div>
    </div>`;
  }

  private renderLightBody(
    dev: { domain: string; suffix: string; id: string; label: string; icon: string },
    e: HassEntity
  ) {
    const p = this.config.panel;
    const s = dev.suffix; // "light_1" / "light_2"
    const on = e.state === "on";
    const modeId = `select.sf_${p}_${s}_mode`;
    const modeE = this.get(modeId);
    const mode = this.modeOf(modeId);

    const curBriE = this.get(`sensor.sf_${p}_${s}_brightness`);
    const curPpfdE = this.get(`sensor.sf_${p}_ppfd`);
    const briTxt = curBriE && Number.isFinite(Number(curBriE.state))
      ? `${Math.round(Number(curBriE.state))}%` : "—";
    const ppfdTxt = curPpfdE && Number.isFinite(Number(curPpfdE.state))
      ? `${Math.round(Number(curPpfdE.state))} µmol` : "—";

    const applyId = `text.sf_${p}_${s}_apply`;
    const goDark = `number.sf_${p}_${s}_go_dark`;
    const turnOff = `number.sf_${p}_${s}_turn_off`;
    const rows: unknown[] = [];
    // Mode select + power (all modes). While a plan runs the controller offers
    // only Manual / PPFD - Plan (mode 1/12 relabelled); otherwise the normal set.
    let planActive = false;
    try { planActive = !!this.planInfo().active; } catch { planActive = false; }
    const modeOpts = planActive
      ? ["Manual", "PPFD - Plan"]
      : ["Manual", "Time Slot", "PPFD"];
    if (modeE) rows.push(this.liveModeRow("Mode", modeId, undefined, modeOpts));
    rows.push(this.powerRow(dev.id, "light", dev.label, on));

    if (mode === "Manual") {
      const bri = Math.round(((e.attributes.brightness ?? 0) / 255) * 100);
      const map: Record<string, string> = {
        [modeId]: "mode",
        [goDark]: "dim_threshold", [turnOff]: "off_threshold",
      };
      rows.push(this.brightnessRow(dev, on ? bri : 0));
      rows.push(this.infoRow("Current PPFD", ppfdTxt));
      rows.push(this.optSelectRow("Go dark", goDark,
        this.tempThresholdOpts()));
      rows.push(this.optSelectRow("Turn off", turnOff,
        this.tempThresholdOpts()));
      rows.push(this.deviceBar(applyId, map, dev));
    } else if (mode === "Time Slot") {
      const startId = `text.sf_${p}_${s}_schedule_start`;
      const stopId = `text.sf_${p}_${s}_schedule_stop`;
      const briId = `number.sf_${p}_${s}_schedule_brightness`;
      const fadeId = `number.sf_${p}_${s}_fade`;
      const map: Record<string, string> = {
        [modeId]: "mode",
        [startId]: "schedule_start", [stopId]: "schedule_end",
        [briId]: "schedule_brightness", [fadeId]: "fade_minutes",
        [goDark]: "dim_threshold", [turnOff]: "off_threshold",
      };
      rows.push(this.infoRow("Current", `${briTxt} · ${ppfdTxt}`));
      const dur = this.durationText(startId, stopId);
      if (dur) rows.push(this.infoRow("Light duration", dur));
      rows.push(this.stagedPeriodRow(startId, stopId, "Lighting period"));
      rows.push(this.optSelectRow("Target Brightness", briId,
        this.numOpts(11, 100, 1, (n) => `${n}%`)));
      rows.push(this.optSelectRow("Simulate Sunrise/Sunset", fadeId,
        this.offOpts(1, 60, 1, (n) => `${n} min`)));
      rows.push(this.optSelectRow("Go dark", goDark,
        this.tempThresholdOpts()));
      rows.push(this.optSelectRow("Turn off", turnOff,
        this.tempThresholdOpts()));
      rows.push(this.deviceBar(applyId, map, dev));
    } else if (mode === "PPFD" || mode === "PPFD - Plan") {
      const startId = `text.sf_${p}_${s}_ppfd_start`;
      const stopId = `text.sf_${p}_${s}_ppfd_stop`;
      const targetId = `number.sf_${p}_${s}_ppfd_target`;
      const fadeId = `number.sf_${p}_${s}_ppfd_fade`;
      const minId = `number.sf_${p}_${s}_ppfd_min`;
      const maxId = `number.sf_${p}_${s}_ppfd_max`;
      const map: Record<string, string> = {
        [modeId]: "mode",
        [startId]: "ppfd_start", [stopId]: "ppfd_end",
        [targetId]: "ppfd_target", [fadeId]: "ppfd_fade_minutes",
        [minId]: "ppfd_min", [maxId]: "ppfd_max",
        [goDark]: "dim_threshold", [turnOff]: "off_threshold",
      };
      rows.push(this.infoRow("Current", `${briTxt} · ${ppfdTxt}`));
      const dur = this.durationText(startId, stopId);
      const durMin = this.durMinutes(startId, stopId);
      const tgt = Number(this.get(targetId)?.state);
      if (dur && durMin != null && Number.isFinite(tgt)) {
        const dli = (tgt * durMin * 60) / 1e6;
        rows.push(this.infoRow("DLI · duration", `${dli.toFixed(2)} mol/m²/day · ${dur}`));
      } else if (dur) {
        rows.push(this.infoRow("Light duration", dur));
      }
      rows.push(this.stagedPeriodRow(startId, stopId, "Lighting period"));
      // Target PPFD (dropdown) with the current PPFD shown alongside it.
      rows.push(html`<div class="dev-row ${targetId in this.draft ? "staged" : ""}">
        <span class="dev-lbl">Target PPFD</span>
        <div class="ctl-input">${this.optSelect(targetId,
          this.numOpts(20, 2000, 10, (n) => `${n} µmol`))}</div>
        <span class="dev-val" style="margin-left:8px" title="current">${ppfdTxt}</span>
      </div>`);
      rows.push(this.optSelectRow("Dimming Range Min", minId,
        this.numOpts(11, 100, 1, (n) => `${n}%`)));
      rows.push(this.optSelectRow("Dimming Range Max", maxId,
        this.numOpts(11, 100, 1, (n) => `${n}%`)));
      rows.push(this.optSelectRow("Simulate Sunrise/Sunset", fadeId,
        this.offOpts(1, 60, 1, (n) => `${n} min`)));
      rows.push(this.optSelectRow("Go dark", goDark,
        this.tempThresholdOpts()));
      rows.push(this.optSelectRow("Turn off", turnOff,
        this.tempThresholdOpts()));
      rows.push(this.deviceBar(applyId, map, dev));
    }
    return rows;
  }

  // ── Mode-aware Fan tile (Manual / Time Slot / Cycle / Environment) ────────
  private renderFanBody(
    dev: { domain: string; suffix: string; id: string; label: string; icon: string },
    e: HassEntity
  ) {
    const p = this.config.panel;
    const on = e.state === "on";
    const modeId = `select.sf_${p}_fan_mode_set`;
    const modeE = this.get(modeId);
    const mode = this.modeOf(modeId);

    const osc = `number.sf_${p}_fan_oscillation`;
    const gear = `number.sf_${p}_fan_schedule_gear`;
    const standby = `number.sf_${p}_fan_standby_speed`;
    const natWind = `switch.sf_${p}_fan_natural_wind`;

    // Dropdowns: Gear L1-L10, Oscillation Off-10 (live), Standby Off..(gear-1).
    const gearRow = () =>
      this.optSelectRow("Gear", gear, this.numOpts(1, 10, 1, (n) => `L${n}`));
    const gearVal = Math.max(1, Math.round(Number(this.draftVal(gear)) || 1));
    // Standby must be below the running gear — unless the gear is Automatic (0),
    // where there's no fixed running gear to sit under, so allow the full range.
    // A blank gear ("" = the Environment config not fetched yet, so the gear reads
    // unknown while the selector still shows "Automatic") is treated the same,
    // otherwise the Standby Speed dropdown collapsed to empty until the mode was
    // toggled off and back. (v3.19.241)
    const gearAuto = ["", "0"].includes(String(this.draftVal(gear)));
    const standbyRow = () =>
      this.optSelectRow("Standby Speed", standby,
        this.offOpts(1, gearAuto ? 10 : gearVal - 1));
    const oscRow = () =>
      this.optSelectRow("Oscillation", osc, this.offOpts(1, 10));

    const applyId = `text.sf_${p}_fan_apply`;
    const rows: unknown[] = [];
    if (modeE) rows.push(this.liveModeRow("Mode", modeId, dev.id));
    // Power toggle only in Manual — other modes aren't power-toggle driven. (#4)
    if (mode === "Manual") rows.push(this.powerRow(dev.id, "fan", dev.label, on));

    if (mode === "Manual") {
      const pct = Math.round(e.attributes.percentage ?? 0);
      rows.push(this.speedRow(dev, on ? pct : 0, 0, 10));   // fan = gears 1-10
      rows.push(oscRow());
      rows.push(this.ctlRow("Natural Wind", natWind));
      rows.push(this.deviceBar(applyId, { [modeId]: "mode" }, dev));
    } else if (mode === "Time Slot") {
      // staged: mode + schedule + gear + standby + oscillation + natwind
      const map: Record<string, string> = {
        [modeId]: "mode",
        [`text.sf_${p}_fan_schedule_start`]: "schedule_start",
        [`text.sf_${p}_fan_schedule_stop`]: "schedule_end",
        [gear]: "schedule_speed",
        [standby]: "standby_speed",
      };
      rows.push(this.stagedPeriodRow(
        `text.sf_${p}_fan_schedule_start`, `text.sf_${p}_fan_schedule_stop`, "Schedule"));
      rows.push(gearRow());
      rows.push(standbyRow());
      rows.push(oscRow());
      rows.push(this.ctlRow("Natural Wind", natWind));
      rows.push(this.deviceBar(applyId, map, dev));
    } else if (mode === "Cycle") {
      const cStart = `text.sf_${p}_fan_cycle_start`;
      const cRun = `text.sf_${p}_fan_cycle_run`;
      const cOff = `text.sf_${p}_fan_cycle_off`;
      const cTimes = `number.sf_${p}_fan_cycle_times`;
      const map: Record<string, string> = {
        [modeId]: "mode",
        [cStart]: "cycle_start",
        [cRun]: "cycle_run",
        [cOff]: "cycle_off",
        [cTimes]: "cycle_times",
        [gear]: "schedule_speed",
        [standby]: "standby_speed",
      };
      rows.push(this.stagedRow("Start Time", cStart, "time"));
      rows.push(this.stagedRow("Run Duration", cRun, "duration"));
      rows.push(this.stagedRow("Off Duration", cOff, "duration"));
      rows.push(this.stagedRangeRow("Execution Times", cTimes));
      rows.push(gearRow());
      rows.push(standbyRow());
      rows.push(oscRow());
      rows.push(this.ctlRow("Natural Wind", natWind));
      rows.push(this.deviceBar(applyId, map, dev));
    } else if (mode === "Environment") {
      const runMode = `select.sf_${p}_fan_run_mode`;
      const map: Record<string, string> = {
        [modeId]: "mode",
        [runMode]: "env_submode",
        [gear]: "schedule_speed",
        [standby]: "standby_speed",
      };
      rows.push(this.stagedRow("Run Mode", runMode));
      // Environment running gear adds "Automatic" (controller picks the gear).
      rows.push(this.optSelectRow("Gear", gear, this.autoOpts(1, 10, 1, (n) => `L${n}`)));
      rows.push(standbyRow());
      rows.push(oscRow());
      rows.push(this.ctlRow("Natural Wind", natWind));
      rows.push(this.deviceBar(applyId, map, dev));
    }
    return rows;
  }

  // ── Mode-aware Blower tile (Manual / Time Slot / Cycle / Environment) ─────
  // Like the fan but no oscillation/natural wind; speed is a % (25-100), the
  // standby range tracks the running speed, and there's a Close-CO2 toggle.
  private renderBlowerBody(
    dev: { domain: string; suffix: string; id: string; label: string; icon: string },
    e: HassEntity
  ) {
    const p = this.config.panel;
    const on = e.state === "on";
    const modeId = `select.sf_${p}_blower_mode_set`;
    const modeE = this.get(modeId);
    const mode = this.modeOf(modeId);

    const runSpeed = `number.sf_${p}_blower_running_speed`;
    const standby = `number.sf_${p}_blower_standby_speed`;
    const closeCo2 = `switch.sf_${p}_blower_close_co2`;
    const applyId = `text.sf_${p}_blower_apply`;

    // Running Speed 25-100 %; Standby Off then 25..(running-1). When running is
    // Automatic (0) there's no fixed running speed to sit under, so Standby gets
    // the full 25-100 range (the app allows e.g. 39% standby with auto running).
    const speedRow = () =>
      this.optSelectRow("Running Speed", runSpeed, this.numOpts(25, 100, 1, (n) => `${n}%`));
    // Automatic (0) or a blank/unknown running speed (config not fetched yet) →
    // no fixed speed to sit under, so give Standby the full range instead of
    // collapsing to empty. (v3.19.241)
    const runAuto = ["", "0"].includes(String(this.draftVal(runSpeed)));
    const runVal = Math.max(25, Math.round(Number(this.draftVal(runSpeed)) || 25));
    const standbyRow = () =>
      this.optSelectRow("Standby Speed", standby,
        this.offOpts(25, runAuto ? 100 : runVal - 1));

    const rows: unknown[] = [];
    if (modeE) rows.push(this.liveModeRow("Mode", modeId, dev.id));
    // Power toggle only in Manual — other modes aren't power-toggle driven. (#4)
    if (mode === "Manual") rows.push(this.powerRow(dev.id, "fan", dev.label, on));

    if (mode === "Manual") {
      const pct = Math.round(e.attributes.percentage ?? 0);
      rows.push(this.speedRow(dev, on ? pct : 0, 25));   // blower min speed 25%
      rows.push(this.ctlRow("Close CO2 Device", closeCo2));
      rows.push(this.deviceBar(applyId, { [modeId]: "mode" }, dev));
    } else if (mode === "Time Slot") {
      const map: Record<string, string> = {
        [modeId]: "mode",
        [`text.sf_${p}_blower_schedule_start`]: "schedule_start",
        [`text.sf_${p}_blower_schedule_stop`]: "schedule_end",
        [runSpeed]: "schedule_speed",
        [standby]: "standby_speed",
      };
      rows.push(this.stagedPeriodRow(
        `text.sf_${p}_blower_schedule_start`, `text.sf_${p}_blower_schedule_stop`, "Schedule"));
      rows.push(speedRow());
      rows.push(standbyRow());
      rows.push(this.ctlRow("Close CO2 Device", closeCo2));
      rows.push(this.deviceBar(applyId, map, dev));
    } else if (mode === "Cycle") {
      const cStart = `text.sf_${p}_blower_cycle_start`;
      const cRun = `text.sf_${p}_blower_cycle_run`;
      const cOff = `text.sf_${p}_blower_cycle_off`;
      const cTimes = `number.sf_${p}_blower_cycle_times`;
      const map: Record<string, string> = {
        [modeId]: "mode",
        [cStart]: "cycle_start",
        [cRun]: "cycle_run",
        [cOff]: "cycle_off",
        [cTimes]: "cycle_times",
        [runSpeed]: "schedule_speed",
        [standby]: "standby_speed",
      };
      rows.push(this.stagedRow("Start Time", cStart, "time"));
      rows.push(this.stagedRow("Run Duration", cRun, "duration"));
      rows.push(this.stagedRow("Off Duration", cOff, "duration"));
      rows.push(this.stagedRangeRow("Execution Times", cTimes));
      rows.push(speedRow());
      rows.push(standbyRow());
      rows.push(this.ctlRow("Close CO2 Device", closeCo2));
      rows.push(this.deviceBar(applyId, map, dev));
    } else if (mode === "Environment") {
      const runMode = `select.sf_${p}_blower_run_mode`;
      const map: Record<string, string> = {
        [modeId]: "mode",
        [runMode]: "env_submode",
        [runSpeed]: "schedule_speed",
        [standby]: "standby_speed",
      };
      rows.push(this.stagedRow("Run Mode", runMode));
      // Environment running speed adds "Automatic" (controller picks the %).
      rows.push(this.optSelectRow(
        "Running Speed", runSpeed, this.autoOpts(25, 100, 1, (n) => `${n}%`)));
      rows.push(standbyRow());
      rows.push(this.ctlRow("Close CO2 Device", closeCo2));
      rows.push(this.deviceBar(applyId, map, dev));
    }
    return rows;
  }

  // Scheduled day/night for this controller. Prefer the device's own schedule
  // binary sensor (present on controllers that expose it); otherwise compare
  // the current time to the Environment tab's Day Cycle start/stop. Returns
  // true (day) / false (night) / null (no schedule info to go on).
  private cycleIsDay(): boolean | null {
    const p = this.config.panel;
    const sched = this.get(`binary_sensor.sf_${p}_daytime_schedule`);
    if (sched && (sched.state === "on" || sched.state === "off"))
      return sched.state === "on";
    const s = hhmmToMin(this.get(`text.sf_${p}_env_day_start`)?.state);
    const e = hhmmToMin(this.get(`text.sf_${p}_env_day_end`)?.state);
    if (s == null || e == null) return null;
    const now = new Date();
    const m = now.getHours() * 60 + now.getMinutes();
    // Normal window (start<end) vs. one that wraps past midnight (start>end).
    return s <= e ? m >= s && m < e : m >= s || m < e;
  }

  // Light present while the schedule says it should be dark. Uses the PPFD
  // sensor when the controller has one (leak = PPFD over the floor); otherwise
  // the hardware daytime light sensor reading "light" during the night cycle.
  private lightLeak(): { on: boolean; text: string } {
    if (this.cycleIsDay() !== false) return { on: false, text: "" };
    const p = this.config.panel;
    const ppfd = this.get(`sensor.sf_${p}_ppfd`);
    if (ppfd) {
      const v = Number(ppfd.state);
      return Number.isFinite(v) && v > LEAK_PPFD
        ? { on: true, text: `Light detected · ${Math.round(v)} µmol` }
        : { on: false, text: "" };
    }
    const ls = this.get(`binary_sensor.sf_${p}_daytime_light_sensor`);
    return ls && ls.state === "on"
      ? { on: true, text: "Light detected" }
      : { on: false, text: "" };
  }

  // "Parameters" header row: label on the left, a day/night cycle pill on the
  // right, and (only when tripped) a centred light-leak alert between them.
  private renderParamsHead() {
    const isDay = this.cycleIsDay();
    const leak = this.lightLeak();
    const badge = isDay === null
      ? nothing
      : html`<span class="cycle-badge"
          style="color:${isDay ? CYCLE_DAY : CYCLE_NIGHT};background:${
            isDay ? "rgba(224,168,58,0.14)" : "rgba(143,155,212,0.16)"}">
          <ha-icon icon=${isDay
            ? "mdi:white-balance-sunny" : "mdi:weather-night"}></ha-icon>${
          isDay ? "Day Cycle" : "Night Cycle"}</span>`;
    return html`
      <div class="params-head">
        <span class="ph-label">Parameters</span>
        <span class="ph-mid">${leak.on
          ? html`<span class="leak-badge">
              <ha-icon icon="mdi:alert"></ha-icon>${leak.text}</span>`
          : nothing}</span>
        ${badge}
      </div>`;
  }

  // Energy Usage tile for metered plugs (S-Station) — Power big with Voltage /
  // Current / Energy beneath, mirroring the SF app's "Energy Usage". (v0.21.29)
  // Whether the Power/Energy tile should show (has a power entity + not hidden).
  private hasEnergyTile(): boolean {
    return !this.hideEnergyTile && !!this.get(`sensor.sf_${this.config.panel}_power`);
  }

  // Just the Energy tile itself (no section label / grid), so it can be placed as
  // a movable tile in the unified panel (Phase 2 Mode B) or inside its own section.
  private energyTile() {
    const p = this.config.panel;
    const fmt = (suffix: string, unit: string, dec: number) => {
      const e = this.get(`sensor.sf_${p}_${suffix}`);
      const v = e ? Number(e.state) : NaN;
      return Number.isFinite(v) ? `${v.toFixed(dec)}${unit}` : "–";
    };
    const open = this.paramOpen === "power";
    const accent = this.accent();
    return html`
      <div class="tile clickable ${open ? "active" : ""}"
        style=${open ? `box-shadow:inset 0 0 0 1px ${accent}` : nothing}
        role="button" aria-expanded=${open ? "true" : "false"}
        @click=${() => this.toggleGraph("power")}>
        <div class="tile-label">
          <span class="tl-name">Power</span>
          <span class="tl-right">
            <ha-icon class="tile-more"
              icon=${open ? "mdi:chevron-up" : "mdi:chart-line"}></ha-icon>
          </span>
        </div>
        <ha-icon icon="mdi:flash" style="color:${accent}"></ha-icon>
        <div class="tile-val">${fmt("power", "", 0)}<span class="unit">W</span></div>
        <div class="tile-target">${fmt("voltage", " V", 0)} · ${fmt("current", " A", 2)}</div>
        <div class="tile-target">${fmt("energy", " kWh", 2)}</div>
      </div>`;
  }

  private renderEnergyTile() {
    if (!this.hasEnergyTile()) return nothing;   // hidden by Settings / no power entity
    const open = this.paramOpen === "power";
    return html`
      <div class="section-label">Energy Usage</div>
      <div class="grid">${this.energyTile()}</div>
      ${open ? this.renderParamGraph() : nothing}`;
  }

  // Render one Overview tile grid. Normal mode: tiles straight into the grid
  // (identical to before). Rearrange mode: each tile wrapped with a drag handle
  // and pointer handlers; inner tile content is inert so taps don't fire.
  private renderTileGrid(sec: "params" | "devices" | "outlets" | "all", tiles: TileItem[]) {
    const ug = sec === "all" ? " ugrid" : "";
    if (!this.reorderMode)
      return html`<div class="grid${ug}">${tiles.map((t) => html`
        ${t.full ? html`<div class="rspan">${t.tpl}</div>` : t.tpl}
        ${t.pop ? html`<div class="rspan tile-exp">${t.pop}</div>` : nothing}`)}</div>`;
    return html`<div class="grid rgrid${ug}"
        @pointerdown=${(e: PointerEvent) => this.onReorderDown(e)}
        @pointermove=${(e: PointerEvent) => this.onReorderMoveEvt(e)}
        @pointerup=${() => this.onReorderUp()}
        @pointercancel=${() => this.onReorderUp()}>
        ${tiles.map((t) => html`
          <div class="rwrap ${this.dragId === t.id ? "dragging" : ""} ${t.full ? "rfull" : ""}"
            data-sec=${sec} data-tid=${t.id}>
            <div class="rhandle"><ha-icon icon="mdi:drag"></ha-icon></div>
            ${this.hideBtn(t.id, false)}
            ${t.tpl}
          </div>`)}
      </div>`;
  }
  // The "Hidden tiles" tray shown at the bottom of Rearrange mode: every hidden
  // tile, each with an eye-off toggle to restore it. (v0.21.86)
  private renderHiddenTray(
    nat: { params: TileItem[]; devices: TileItem[]; outlets: TileItem[]; energy: TileItem | null }
  ) {
    if (!this.reorderMode) return nothing;
    const hid = this.effHidden();
    const seen = new Set<string>();
    const all: TileItem[] = [];
    const add = (t: TileItem) => { if (!seen.has(t.id)) { seen.add(t.id); all.push(t); } };
    nat.params.forEach(add); nat.devices.forEach(add); nat.outlets.forEach(add);
    if (nat.energy) add(nat.energy);
    this.unifiedNatural(nat).forEach(add);
    const hidden = all.filter((t) => hid[t.id]);
    return html`<div class="hidden-tray">
      <div class="section-label">Hidden tiles</div>
      ${hidden.length
        ? html`<div class="grid">${hidden.map((t) => html`
            <div class="rwrap rhidden">${this.hideBtn(t.id, true)}${t.tpl}</div>`)}</div>`
        : html`<div class="ht-note">Tap the eye icon on any tile above to hide it here.</div>`}
    </div>`;
  }

  // The rearrange instruction + Reset + Apply/Discard bar, shown atop Overview
  // while rearranging. Uses commitBar directly (a card-option write is instant —
  // no device round-trip to spin on).
  private renderReorderBar() {
    const accent = this.accent();
    return html`<div class="reorder-bar">
      <div class="reorder-note">
        <ha-icon icon="mdi:drag-variant"></ha-icon>
        <span>Drag to rearrange; tap the eye to hide a tile. Changes save on Apply.</span>
      </div>
      <button class="reorder-reset" @click=${() => this.resetOrder()}>Reset order</button>
      ${commitBar(accent, this.reorderDirty(),
        () => this.exitReorder(true), () => this.exitReorder(false), "apply-bar")}
    </div>`;
  }

  private renderOverview() {
    // Phase 2. layoutMode "sections" = reorder within each section (Mode A);
    // "unified" = one merged free-move grid, no separators (Mode B, energy tile
    // included, outlets always shown). Order = live draft while rearranging, else
    // saved; empty order → default (unchanged).
    const ro = this.reorderMode;
    const nat = this.overviewNatural();
    const ord = (sec: "params" | "devices" | "outlets" | "all") =>
      (ro && this.tileOrderDraft ? this.tileOrderDraft[sec] : this.tileOrder[sec]);

    // Hidden tiles are filtered out of the normal grids (both modes); in Rearrange
    // they move to the Hidden tray at the bottom. (v0.21.86)
    const vis = (arr: TileItem[]) => arr.filter((t) => !this.isHidden(t.id));

    if (this.layoutMode === "unified") {
      // Expansions render inline under their tile (via TileItem.pop), not at the bottom.
      const merged = vis(this.unifiedOrder(this.unifiedNatural(nat), ord("all")));
      return html`
        ${ro ? this.renderReorderBar() : nothing}
        ${merged.length ? this.renderTileGrid("all", merged) : nothing}
        ${this.renderHiddenTray(nat)}`;
    }

    // Sections mode (Mode A)
    const params = vis(this.applyOrder(nat.params, (t) => t.id, ord("params")));
    const devices = vis(this.applyOrder(nat.devices, (t) => t.id, ord("devices")));
    const outlets = vis(this.applyOrder(nat.outlets, (t) => t.id, ord("outlets")));
    return html`
      ${ro ? this.renderReorderBar() : nothing}
      ${params.length
        ? html`${this.renderParamsHead()}
            ${this.renderTileGrid("params", params)}`
        : nothing}
      ${this.hasEnergyTile() && !this.isHidden("energy")
        ? html`<div class="section-label">Energy Usage</div>
            <div class="grid">${ro
              ? html`<div class="rwrap">${this.hideBtn("energy", false)}${this.energyTile()}</div>`
              : this.energyTile()}</div>
            ${this.paramOpen === "power" && !ro ? this.renderParamGraph() : nothing}`
        : nothing}
      ${devices.length
        ? html`<div class="section-label">Devices</div>
            ${ro ? nothing : this.renderDeviceQuickRow()}
            ${this.renderTileGrid("devices", devices)}`
        : nothing}
      ${(this.outletsOnOverview || this.outletQuickOverview) && this.hasOutlets()
        ? html`<div class="section-label">Outlets</div>
            ${this.outletQuickOverview && !ro
              ? this.outletSlots().map((sl) => this.renderQuickRow(sl)) : nothing}
            ${this.outletsOnOverview ? this.renderTileGrid("outlets", outlets) : nothing}`
        : nothing}
      ${this.renderHiddenTray(nat)}`;
  }


  // ── Local staging (hybrid Save) ───────────────────────────────────────────
  // Schedule/cycle/environment inputs write here instead of firing per-field
  // service calls; a Save button commits them as one atomic device write.
  private draftVal(id: string): string {
    if (id in this.draft) return this.draft[id];
    const e = this.get(id);
    return e && e.state !== "unknown" && e.state !== "unavailable" ? e.state : "";
  }
  private stage(id: string, val: string) {
    this.draft = { ...this.draft, [id]: val };
  }
  private clearDraft() {
    if (Object.keys(this.draft).length) this.draft = {};
  }
  // Discard button: drop staged edits AND any staged (un-saved) mode change so
  // the tile reverts to the device's confirmed mode.
  private discardEdits() {
    this.clearDraft();
    if (Object.keys(this.modePick).length) this.modePick = {};
  }
  // Close/switch a device tile; abandon any uncommitted edits.
  private toggleDevice(key: string | null) {
    this.clearDraft();
    if (Object.keys(this.modePick).length) this.modePick = {};
    this.deviceOpen = key;
  }
  // Current mode for a tile, honoring an optimistic pick over entity state.
  private modeOf(id: string, fallback = "Manual"): string {
    return this.modePick[id] ?? this.get(id)?.state ?? fallback;
  }

  // Staged input variants (no service call — update draft only). `kind` forces
  // a control: "time" = HH:MM picker, "duration" = HH:MM:SS picker.
  private stagedInput(id: string, kind?: "time" | "duration") {
    const e = this.get(id);
    if (!e) return nothing;
    const domain = id.split(".")[0];
    const v = this.draftVal(id);
    if (!kind && domain === "number") {
      const min = e.attributes.min ?? 0;
      const max = e.attributes.max ?? 100;
      const step = e.attributes.step ?? 1;
      const unit = e.attributes.unit_of_measurement ?? "";
      return html`<span class="num-box">
        <input type="number" min=${min} max=${max} step=${step} .value=${v}
          @input=${(ev: Event) =>
            this.stage(id, (ev.target as HTMLInputElement).value)} />
        <span class="unit">${unit}</span></span>`;
    }
    if (!kind && domain === "select") {
      const options: string[] = e.attributes.options ?? [];
      // Display label may be prettified (e.g. title-case run modes) while the
      // option VALUE stays the entity's own string so the command is unchanged.
      const optLabel = (o: string) => RUN_MODE_LABELS[o.toLowerCase()] ?? o;
      return html`<select @change=${(ev: Event) =>
        this.stage(id, (ev.target as HTMLSelectElement).value)}>
        ${options.map((o) => html`<option value=${o} .selected=${o === v}>${optLabel(o)}</option>`)}
      </select>`;
    }
    // A Duration is an ELAPSED time (how long to run / stay off), not a clock
    // time — so it gets h / min / s spinners like the SF app ("00h 00min 00s"),
    // never a native AM/PM time picker.
    if (kind === "duration") return this.durationInput(id);
    // Start Time and other clock fields use the native time picker.
    const isTime = kind === "time" || /^\d{1,2}:\d{2}/.test(v);
    return html`<input type=${isTime ? "time" : "text"} .value=${v}
      @change=${(ev: Event) =>
        this.stage(id, (ev.target as HTMLInputElement).value)} />`;
  }
  // Elapsed-duration editor: three number boxes (h / min / s) that read and
  // write the underlying "HH:MM:SS" text the device uses. Matches the SF app's
  // Run Duration / Off Duration spinners instead of a clock/AM-PM picker.
  private durationInput(id: string) {
    const raw = (this.draftVal(id) || "").trim();
    const m = /^(\d+):(\d{1,2})(?::(\d{1,2}))?$/.exec(raw);
    const h = m ? +m[1] : 0;
    const mi = m ? +m[2] : 0;
    const s = m ? +(m[3] ?? 0) : 0;
    const p2 = (n: number) => String(n).padStart(2, "0");
    const emit = (nh: number, nm: number, ns: number) =>
      this.stage(id, `${p2(Math.max(0, Math.min(99, nh)))}:${
        p2(Math.max(0, Math.min(59, nm)))}:${p2(Math.max(0, Math.min(59, ns)))}`);
    const box = (val: number, max: number, unit: string,
                 on: (n: number) => void) => html`
      <span class="dur-box">
        <input type="number" min="0" max=${max} step="1" .value=${String(val)}
          @input=${(ev: Event) =>
            on(Math.floor(Number((ev.target as HTMLInputElement).value) || 0))} />
        <span class="dur-unit">${unit}</span>
      </span>`;
    return html`<span class="dur-input">
      ${box(h, 99, "h", (n) => emit(n, mi, s))}
      ${box(mi, 59, "min", (n) => emit(h, n, s))}
      ${box(s, 59, "s", (n) => emit(h, mi, n))}
    </span>`;
  }
  // Build [{label,value}] options for a numeric range (value is the string sent
  // to the device). `fmt` formats the visible label.
  private numOpts(
    min: number, max: number, step = 1, fmt: (n: number) => string = String
  ): { label: string; value: string }[] {
    const out: { label: string; value: string }[] = [];
    // Count-based loop + per-step rounding avoids float drift on decimal steps
    // (e.g. 0.1 offsets: 17.999999… → 18.0).
    const dec = (String(step).split(".")[1] || "").length;
    const count = step > 0 ? Math.round((max - min) / step) : 0;
    for (let i = 0; i <= count; i++) {
      const n = Number((min + i * step).toFixed(dec));
      out.push({ label: fmt(n), value: String(n) });
    }
    return out;
  }
  // "Off" (value 0) followed by a numeric range.
  private offOpts(min: number, max: number, step = 1, fmt?: (n: number) => string) {
    return [{ label: "Off", value: "0" }, ...this.numOpts(min, max, step, fmt)];
  }
  // "Automatic" (value 0) followed by a numeric range — the Environment-mode
  // running gear/speed for fan & blower (maxSpeed 0 = the controller picks it).
  private autoOpts(min: number, max: number, step = 1, fmt?: (n: number) => string) {
    return [{ label: "Automatic", value: "0" }, ...this.numOpts(min, max, step, fmt)];
  }
  // A dropdown built from an explicit option list, over a number/text entity.
  // Staged by default; `live` writes the number entity immediately. Matches the
  // current value to an option numerically so e.g. "93" selects the 93 option.
  private optSelect(
    id: string,
    options: { label: string; value: string }[],
    live = false
  ) {
    const e = this.get(id);
    if (!e) return nothing;
    const cur = this.draftVal(id);
    const sel = options.find((o) => Number(o.value) === Number(cur))?.value
      ?? options.find((o) => o.value === cur)?.value
      ?? cur;
    const onChange = (ev: Event) => {
      const v = (ev.target as HTMLSelectElement).value;
      if (live) this.hass?.callService("number", "set_value",
        { entity_id: id, value: Number(v) });
      else this.stage(id, v);
    };
    return html`<select @change=${onChange}>
      ${options.map((o) => html`
        <option value=${o.value} .selected=${String(o.value) === String(sel)}>${o.label}</option>`)}
    </select>`;
  }
  private optSelectRow(
    label: string,
    id: string,
    options: { label: string; value: string }[],
    live = false
  ) {
    if (!this.get(id)) return nothing;
    const cls = !live && id in this.draft ? "dev-row staged" : "dev-row";
    return html`<div class=${cls}>
      <span class="dev-lbl">${label}</span>
      <div class="ctl-input">${this.optSelect(id, options, live)}</div>
    </div>`;
  }
  private stagedRow(label: string, id: string, kind?: "time" | "duration") {
    if (!this.get(id)) return nothing;
    const cls = id in this.draft ? "dev-row staged" : "dev-row";
    return html`<div class=${cls}>
      <span class="dev-lbl">${label}</span>
      <div class="ctl-input">${this.stagedInput(id, kind)}</div>
    </div>`;
  }
  // Staged dropdown built from a number entity's own range, forced to whole
  // numbers (used for Execution Times: integer 1-N, no decimals).
  private stagedRangeRow(label: string, id: string, fmt?: (n: number) => string) {
    const e = this.get(id);
    if (!e) return nothing;
    const min = Math.round(Number(e.attributes.min ?? 1));
    const max = Math.round(Number(e.attributes.max ?? 100));
    const step = Math.max(1, Math.round(Number(e.attributes.step ?? 1)));
    return this.optSelectRow(label, id, this.numOpts(min, max, step, fmt));
  }
  private stagedPeriodRow(startId: string, stopId: string, label: string) {
    const se = this.get(startId);
    const ee = this.get(stopId);
    if (!se && !ee) return nothing;
    const dirty = startId in this.draft || stopId in this.draft;
    return html`<div class="dev-row period-row ${dirty ? "staged" : ""}">
      <span class="dev-lbl">${label}</span>
      <div class="period-times">
        ${se ? this.stagedInput(startId, "time") : nothing}
        <span class="dash">–</span>
        ${ee ? this.stagedInput(stopId, "time") : nothing}
      </div>
    </div>`;
  }
  // Mode selector. Picking a *scheduled* mode (anything but Manual) only
  // switches the tile view — it stages the mode and commits it together with
  // that mode's settings on Save (matches the SF app: Save sets AND activates,
  // so choosing Time Slot doesn't turn the device on until you save). Manual is
  // direct control, so it applies immediately. `modeId` lets the tile include
  // the staged mode in its Save bundle.
  // Staged mode select. Switching mode discards other staged edits (they belong
  // to the old mode), optimistically shows the new mode's body, and commits the
  // mode with the rest on Apply.
  private liveModeRow(label: string, id: string, powerId?: string,
                      optionsOverride?: string[]) {
    const e = this.get(id);
    if (!e) return nothing;
    const options: string[] = optionsOverride ?? e.attributes.options ?? [];
    const cur = this.modeOf(id, e.state);
    return html`<div class="dev-row ${id in this.draft ? "staged" : ""}">
      <span class="dev-lbl">${label}</span>
      <div class="ctl-input">
        <select @change=${(ev: Event) => {
          const val = (ev.target as HTMLSelectElement).value;
          this.modePick = { ...this.modePick, [id]: val };
          // Switching a climate/fan device to Manual defaults the power toggle to
          // OFF, so it doesn't silently stay on when you drop out of an auto mode.
          // (Bugs.txt #5)
          this.draft = powerId && val === "Manual"
            ? { [id]: val, [`power:${powerId}`]: "off" }
            : { [id]: val };
        }}>
          ${options.map((o) => html`
            <option value=${o} .selected=${o === cur}>${o}</option>`)}
        </select>
      </div>
    </div>`;
  }
  // Apply/Discard bar. `map` is entityId -> device subfield key; only staged
  // entries in this map are committed.
  private commitBundle(applyId: string, map: Record<string, string>) {
    const bundle: Record<string, string | number> = {};
    for (const [id, sub] of Object.entries(map)) {
      if (id in this.draft) {
        const raw = this.draft[id];
        bundle[sub] = id.split(".")[0] === "number" ? Number(raw) : raw;
      }
    }
    if (!Object.keys(bundle).length) return;
    // v3.19.40: the per-device "<X> Apply" text entities are gone (HA always
    // listed them on the device page, even when hidden). Saves now go through
    // the sf.apply_bundle service. The old write channel is still used when
    // the entity exists, so this card keeps working on older integrations.
    const m = applyId.match(
      /_(light_1|light_2|fan|blower|heater|humidifier|dehumidifier)_apply$/);
    const mod = m
      ? (m[1] === "light_1" ? "light" : m[1] === "light_2" ? "light2" : m[1])
      : null;
    if (mod && !this.get(applyId)) {
      this.hass?.callService("sf", "apply_bundle", {
        entity_id: Object.keys(map)[0],
        module: mod,
        settings: bundle,
      });
    } else {
      this.hass?.callService("text", "set_value", {
        entity_id: applyId,
        value: JSON.stringify(bundle),
      });
    }
    const rest = { ...this.draft };
    for (const id of Object.keys(map)) delete rest[id];
    this.draft = rest;
  }

  // ── Tab-level staged Apply (Environment / Calibration / Outlets) ──────────
  // A staged toggle: flips the draft value only, committed by Apply.
  private stagedSwitch(id: string) {
    // Staged edit wins; then an in-flight optimistic outlet toggle (so the pop's
    // Power control doesn't bounce back after Apply clears the draft); else live.
    const on = id in this.draft
      ? this.draft[id] === "on"
      : (this.outPend(id)?.on ?? this.get(id)?.state === "on");
    return html`<button class="toggle ${on ? "on" : ""}"
      style=${on ? `background:${this.accent()}` : ""}
      @click=${() => this.stage(id, on ? "off" : "on")} aria-label="Toggle"></button>`;
  }
  // A staged control in the ".ctl" (label + input) layout, picking the right
  // input for the entity's domain (switch toggle, else number/select/text).
  private stagedCtl(id: string, label?: string, kind?: "time" | "duration") {
    const e = this.get(id);
    if (!e) return nothing;
    const lbl = label ?? e.attributes.friendly_name ?? id.split(".")[1];
    const input = id.split(".")[0] === "switch"
      ? this.stagedSwitch(id) : this.stagedInput(id, kind);
    const staged = id in this.draft;
    return html`
      <div class="ctl ${staged ? "staged" : ""}">
        <div class="ctl-label">${lbl}</div>
        <div class="ctl-input">${input}</div>
      </div>`;
  }
  // Commit every staged edit whose id is in `ids`, each via the service that
  // matches its domain, then drop those ids from the draft.
  private applyStaged(ids: string[]) {
    for (const id of ids) {
      if (!(id in this.draft)) continue;
      const raw = this.draft[id];
      switch (id.split(".")[0]) {
        case "number":
          this.hass?.callService("number", "set_value",
            { entity_id: id, value: Number(raw) }); break;
        case "text":
          this.hass?.callService("text", "set_value",
            { entity_id: id, value: raw }); break;
        case "select":
          this.hass?.callService("select", "select_option",
            { entity_id: id, option: raw }); break;
        case "switch":
          this.hass?.callService("switch", raw === "on" ? "turn_on" : "turn_off",
            { entity_id: id });
          // Paint the applied state optimistically so the outlet tile doesn't bounce
          // back to the (briefly stale) live state once the draft clears below.
          if (/^switch\.sf_.+_outlet_\d+$/.test(id))
            this.markOutPend(id, raw === "on");
          break;
      }
    }
    const rest = { ...this.draft };
    for (const id of ids) delete rest[id];
    this.draft = rest;
  }
  private discardStaged(ids: string[]) {
    const rest = { ...this.draft };
    let changed = false;
    for (const id of ids) if (id in rest) { delete rest[id]; changed = true; }
    if (changed) this.draft = rest;
  }
  // Bottom Apply/Discard bar. Disabled until something in `ids` (or the extra
  // dirty flag, e.g. an outlet schedule) is staged. onApply/onDiscard run any
  // extra commit/revert beyond the scalar draft (e.g. the Time Slot schedule).
  private applyBar(
    ids: string[],
    opts: { extraDirty?: boolean; onApply?: () => void; onDiscard?: () => void } = {}
  ) {
    const dirty = !!opts.extraDirty || ids.some((id) => id in this.draft);
    return this.saveBar(dirty,
      () => { this.applyStaged(ids); opts.onApply?.(); },
      () => { this.discardStaged(ids); opts.onDiscard?.(); },
      "apply-bar");
  }
  // Every staged-able entity id on the Environment tab.
  private envIds(): string[] {
    const p = this.config.panel;
    const ids: string[] = [];
    for (const t of [`text.sf_${p}_env_day_start`, `text.sf_${p}_env_day_end`])
      if (this.get(t)) ids.push(t);
    for (const [, day, night, dz] of ENV_ROWS)
      for (const f of [night, day, dz]) {
        const id = `number.sf_${p}_${f}`;
        if (this.get(id)) ids.push(id);
      }
    // Leaf VPD target min/max are staged with the rest of the Environment tab.
    for (const f of ["leaf_vpd_min", "leaf_vpd_max"]) {
      const id = `number.sf_${p}_${f}`;
      if (this.get(id)) ids.push(id);
    }
    return ids;
  }
  // Every staged-able entity id on the Calibration tab.
  private caliIds(): string[] {
    const p = this.config.panel;
    const ids: string[] = [];
    for (const f of ["cal_air_temp", "cal_air_humidity", "cal_ppfd", "cal_co2"]) {
      const id = `number.sf_${p}_${f}`;
      if (this.get(id)) ids.push(id);
    }
    for (const slot of this.caliSoilSlots()) {
      for (const f of ["cal_temp", "cal_moisture", "cal_ec"]) {
        const id = `number.sf_${p}_${slot}_${f}`;
        if (this.get(id)) ids.push(id);
      }
      const sub = `select.sf_${p}_${slot}_substrate`;
      if (this.get(sub)) ids.push(sub);
    }
    for (const leafOff of [`number.sf_${p}_leaf_offset`,
                           `number.sf_${p}_leaf_offset_night`])
      if (this.get(leafOff)) ids.push(leafOff);
    return ids;
  }

  private hasEnv(): boolean {
    return !!this.get(`number.sf_${this.config.panel}_env_temp_day`);
  }
  private outletSlots(): string[] {
    // The panel's OWN outlets (when it's a strip like AC5/AC10/S-Station) always
    // render — no need to list it as a nested device. Plus any strips actually
    // nested under this panel (e.g. an AC5 hosted by a Display Panel), gated by
    // the card's `outlets` config so a multi-strip host can show just some.
    const panel = this.config.panel ?? "";
    const configured = this.config.outlets ?? [];
    if (!this.hass) return configured;
    const out: string[] = [];
    if (panel && this.get(`switch.sf_${panel}_outlet_1`)) out.push(panel);
    const nested = new Set(nestedOutletSlots(this.hass, panel));
    for (const s of configured) if (s !== panel && nested.has(s)) out.push(s);
    return out;
  }
  private hasOutlets(): boolean {
    return this.outletSlots().some((slot) => {
      for (let n = 1; n <= MAX_OUTLETS; n++) {
        if (this.get(`select.sf_${slot}_outlet_${n}_mode`)) return true;
      }
      return false;
    });
  }
  // An "outlet-only" device — a power strip (AC5/AC10/S-Station) with outlets
  // but no air sensor, no soil probe, and no climate/fan/light devices. Such a
  // card is pure outlet control, so the Environment / VPD / Calibration / Alerts
  // tabs (and their Settings sections) don't apply and are hidden. Any device
  // that reports sensors or devices behaves exactly as before. (v0.21.24)
  private outletOnly(): boolean {
    if (!this.hasOutlets()) return false;
    const hasAir = !!(this.get(this.eid("sensor", "temperature"))
      || this.get(this.eid("sensor", "humidity")));
    const hasSoil = !!this.get(this.eid("sensor", "soil_avg_temperature"));
    const hasDevices = this.overviewDevices().length > 0;
    // Environment-capable (has target setpoints / a plan — e.g. AC5 on an
    // external sensor) is NOT outlet-only, even with nothing live reporting yet:
    // it keeps Overview + Environment so the plan/targets remain reachable.
    const hasEnv = !!this.get(this.eid("number", "env_temp_day"));
    return !hasAir && !hasSoil && !hasDevices && !hasEnv;
  }

  // A dropdown over a number entity, options generated from its own
  // min/max/step/unit. Used by the Environment and Calibration tabs (replaces
  // the number boxes and sliders). Staged — the tab's Apply button commits it.
  private rangeSelect(id: string) {
    const en = this.get(id);
    if (!en) return nothing;
    const min = Number(en.attributes.min ?? 0);
    const max = Number(en.attributes.max ?? 100);
    const step = Number(en.attributes.step ?? 1) || 1;
    const unit = en.attributes.unit_of_measurement ?? "";
    return this.optSelect(id, this.numOpts(min, max, step, (n) => `${n}${unit}`), false);
  }
  private envControl(id: string, label: string) {
    if (!this.get(id)) return nothing;
    return html`
      <div class="ctl">
        <div class="ctl-label">${label}</div>
        <div class="ctl-input">${this.rangeSelect(id)}</div>
      </div>`;
  }

  private planEntity() {
    return this.get(`sensor.sf_${this.config.panel}_plan`);
  }
  private hasPlan(): boolean {
    return !!this.planEntity();
  }
  private planInfo(): { active: boolean; stages: any[]; progress: any } {
    const e = this.planEntity();
    const a = e?.attributes ?? {};
    return {
      active: !!a.active,
      stages: Array.isArray(a.stages) ? a.stages : [],
      progress: a.progress && typeof a.progress === "object" ? a.progress : {},
    };
  }

  private renderEnv() {
    if (!this.hasEnv())
      return html`<div class="cali-empty">No environment targets reported for this device yet.</div>`;
    // Devices with no grow-plan capability keep the plain Environment view.
    if (!this.hasPlan()) return this.renderEnvBody(true);
    const plan = this.planInfo();
    // Default sub-view follows the plan: when a plan is running the tab opens on
    // the Planting Plan view (so stale manual targets aren't shown as if live);
    // otherwise it opens on the Environment editor. A manual tap overrides until
    // you leave the tab.
    const sub = this.envSubView ?? (plan.active ? "plan" : "env");
    const acc = this.accent();
    const seg = (id: "env" | "plan", label: string) => html`
      <button class="env-seg ${sub === id ? "active" : ""}"
        style=${sub === id ? `color:${acc};border-color:${acc}` : ""}
        @click=${() => (this.envSubView = id)}>${label}</button>`;
    return html`
      <div class="env-seg-row">
        ${seg("env", "Environment")}
        ${seg("plan", "Planting Plan")}
      </div>
      ${sub === "plan" ? this.renderPlan(plan) : this.renderEnvBody(false)}`;
  }

  private renderEnvBody(showLabel: boolean) {
    const p = this.config.panel;
    const dayStart = `text.sf_${p}_env_day_start`;
    const dayEnd = `text.sf_${p}_env_day_end`;
    const hasCycle = this.get(dayStart) || this.get(dayEnd);
    return html`
      ${showLabel ? html`<div class="section-label">Environment</div>` : nothing}
      ${hasCycle
        ? html`<div class="env-cycle">
            ${this.stagedCtl(dayStart, "Day Cycle Start", "time")}
            ${this.stagedCtl(dayEnd, "Day Cycle Stop", "time")}
          </div>`
        : nothing}
      ${ENV_ROWS.map(([label, day, night, dz, icon]) => {
        if (!this.get(`number.sf_${p}_${day}`)) return nothing;
        return html`
          <div class="env-row">
            <div class="env-row-head">
              <ha-icon icon=${icon} style="color:${this.accent()}"></ha-icon>
              <span>${label}</span>
            </div>
            <div class="env-grid">
              ${this.envControl(`number.sf_${p}_${night}`, "Night")}
              ${this.envControl(`number.sf_${p}_${day}`, "Day")}
              <span class="env-spacer"></span>
              ${this.envControl(`number.sf_${p}_${dz}`, "Dead Zone")}
            </div>
          </div>`;
      })}
      ${this.renderLeafVpdTargets()}
      ${this.renderVpd()}
      ${this.applyBar(this.envIds())}`;
  }

  // ── Planting Plan view (v3.19.149) ────────────────────────────────────────
  // Read-only in phase 1: create/enable/disable a plan in the Spider Farmer app.
  // While a plan runs the controller drives the environment from the plan, so
  // the card shows the plan here instead of the (paused) manual targets.
  private renderPlan(plan: { active: boolean; stages: any[]; progress: any }) {
    if (this.planEditStage != null && this.planDraft)
      return this.renderStageEditor(this.planEditStage);
    if (this.planTplOpen) return this.renderPlanTemplatePicker();
    const acc = this.accent();
    const p = this.config.panel;
    const swId = `switch.sf_${p}_plan_enabled`;
    const canToggle = !!this.get(swId);
    const stages = plan.stages;
    const prog = plan.progress || {};
    // Stage list: only the current stage by default, with a "show more"; each
    // stage has an Edit pencil, and an Add stage button at the end.
    const stageList = (curId: any) => {
      const curIdx = Math.max(0, stages.findIndex((s: any) => s.stageId === curId));
      const idxs = this.planShowAll ? stages.map((_: any, i: number) => i) : [curIdx];
      return html`
        <div class="section-label">Stages</div>
        ${idxs.map((i: number) => this.renderPlanStage(stages[i], curId, i))}
        ${stages.length > 1 ? html`<button class="plan-editbtn" style="margin:2px 0 6px"
          @click=${() => { this.planShowAll = !this.planShowAll; }}>
          ${this.planShowAll ? "Show less" : `Show all ${stages.length} stages`}</button>` : nothing}
        <div style="display:flex;gap:10px">
          <button class="plan-btn" style="flex:1" @click=${() => this.addPlanStage()}>+ Add stage</button>
          <button class="plan-btn" style="flex:1" @click=${() => { this.planTplOpen = "append"; }}>+ From template</button>
        </div>`;
    };
    const startStop = (label: string, running: boolean) => {
      // Show "Please Wait" only while the pending action is still in progress for
      // this button's current state — as soon as the plan sensor flips, `running`
      // changes and the normal label returns (no flash).
      const waiting = (this._planPending === "start" && !running)
        || (this._planPending === "stop" && running);
      if (waiting) {
        return html`
          <button class="plan-btn ${running ? "stop" : "start"}" disabled
            style="opacity:.7;cursor:default${running ? "" : `;background:${acc};border-color:${acc};color:#0c1f06`}">
            ${this._planPending === "start" ? "Starting — Please Wait…" : "Stopping — Please Wait…"}
          </button>`;
      }
      return html`
        <button class="plan-btn ${running ? "stop" : "start"}"
          style=${running ? "" : `background:${acc};border-color:${acc};color:#0c1f06`}
          @click=${() => {
            // Pin the Planting Plan view so stopping (which makes the plan
            // inactive) doesn't auto-flip the tab back to the Environment editor.
            this.envSubView = "plan";
            this._planPending = running ? "stop" : "start";
            if (this._planPendTimer) clearTimeout(this._planPendTimer);
            this._planPendTimer = setTimeout(() => {
              this._planPending = ""; this.requestUpdate();
            }, 15000);   // safety cap if the state never settles
            this.hass?.callService(
              "switch", running ? "turn_off" : "turn_on", { entity_id: swId });
            // Follow the SF app: a running plan drives the light(s) in "Planting
            // Plan" mode; stopping returns them to Manual. (v0.21.38)
            this.setPlanLights(!running);
          }}>
          ${label}</button>`;
    };

    if (!plan.active) {
      if (!stages.length)
        return html`
          <div class="plan-empty">
            <ha-icon icon="mdi:sprout-outline"></ha-icon>
            <div class="plan-empty-title">No planting plan running</div>
            <div class="plan-empty-sub">
              Create a plan here, or in the Spider Farmer app. While a plan runs
              the manual Environment targets pause.
            </div>
            <div style="display:flex;gap:10px;max-width:340px;margin:14px auto 0">
              <button class="plan-btn" style="flex:1;background:${acc};border-color:${acc};color:#0c1f06"
                @click=${() => { this.planTplOpen = "new"; }}>From template</button>
              <button class="plan-btn" style="flex:1"
                @click=${() => this.startPlanEdit(true)}>Custom</button>
            </div>
          </div>`;
      return html`
        <div class="plan-banner">
          <ha-icon icon="mdi:sprout-outline" style="color:var(--secondary-text-color)"></ha-icon>
          <div style="flex:1">
            <div class="plan-banner-title">Planting plan stopped</div>
            <div class="plan-banner-sub">
              ${stages.length} stage${stages.length === 1 ? "" : "s"} · running the manual Environment targets
            </div>
          </div>
        </div>
        ${stageList(null)}
        ${canToggle ? html`<div class="plan-actions">${startStop("Start Plan", false)}</div>` : nothing}`;
    }

    const cur = stages.find((s: any) => s.stageId === prog.stageId) || stages[0];
    const pct = Number(prog.progress);
    const hasBar = Number.isFinite(pct);
    const days: string[] = [];
    if (prog.planted != null) days.push(`${this.fmtNum(prog.planted)} planted`);
    if (prog.remain != null) days.push(`${this.fmtNum(prog.remain)} left`);
    if (prog.totalDays != null) days.push(`${this.fmtNum(prog.totalDays)} total`);
    return html`
      <div class="plan-banner">
        <ha-icon icon="mdi:sprout" style="color:${acc}"></ha-icon>
        <div style="flex:1">
          <div class="plan-banner-title">${(cur && cur.label) || "Planting plan active"}</div>
          <div class="plan-banner-sub">
            ${days.length ? days.join(" · ") + " days"
              : `${stages.length} stage${stages.length === 1 ? "" : "s"} · managed by the controller`}
          </div>
        </div>
        ${hasBar ? html`<div class="plan-pct" style="color:${acc}">${Math.round(pct)}%</div>` : nothing}
      </div>
      ${hasBar
        ? html`<div class="plan-bar"><div class="plan-bar-fill"
            style="width:${Math.max(0, Math.min(100, pct))}%;background:${acc}"></div></div>`
        : nothing}
      ${stageList(prog.stageId)}
      ${canToggle ? html`<div class="plan-actions">${startStop("Stop Plan", true)}</div>` : nothing}
      <div class="plan-note">
        <ha-icon icon="mdi:information-outline"></ha-icon>
        <span>While a plan is active the controller sets temperature, humidity
        and CO₂ from the plan schedule. Switch to Environment to see the manual
        targets used when no plan runs.</span>
      </div>`;
  }

  // Decode a stage date code: ((year*12+month+494344) << 8) | day-of-month.
  private decodePlanDate(code: any): Date | null {
    const n = Number(code);
    if (!Number.isFinite(n) || n <= 0) return null;
    const day = n & 0xff;
    const months = (n >> 8) - 494344;
    if (months <= 0 || day < 1 || day > 31) return null;
    const d = new Date(Math.floor((months - 1) / 12), (months - 1) % 12, day);
    return isNaN(d.getTime()) ? null : d;
  }
  // "Jun 1 – Oct 31 · 153 days" for a stage's start/end codes, or "".
  private planStageDates(s: any): string {
    const a = this.decodePlanDate(s.start), b = this.decodePlanDate(s.end);
    if (!a || !b) return "";
    const fmt = (d: Date) =>
      d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const days = Math.round((b.getTime() - a.getTime()) / 86400000) + 1;
    const yr = a.getFullYear() !== b.getFullYear() ? `, ${b.getFullYear()}` : "";
    return `${fmt(a)} – ${fmt(b)}${yr} · ${days} day${days === 1 ? "" : "s"}`;
  }

  // Encode "YYYY-MM-DD" -> stage date code, and a code -> input value string.
  private encodePlanCode(dateStr: string): number | null {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr || "");
    if (!m) return null;
    const y = +m[1], mo = +m[2], d = +m[3];
    if (mo < 1 || mo > 12 || d < 1 || d > 31) return null;
    return ((y * 12 + mo + 494344) << 8) | d;
  }
  private codeToInputDate(code: any): string {
    const d = this.decodePlanDate(code);
    if (!d) return "";
    const p = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
  }
  private tempUnitF(): boolean {
    const u = this.get(`number.sf_${this.config.panel}_env_temp_day`)?.attributes
      ?.unit_of_measurement;
    return u === "°F" || u === "℉";
  }
  // A draft-bound dropdown (plain <select> over the plan draft, not an entity).
  private peSelect(cur: any, options: { label: string; value: string }[],
                   onChange: (v: string) => void) {
    const match = options.find((o) => Number(o.value) === Number(cur))?.value
      ?? options.find((o) => o.value === String(cur))?.value ?? String(cur ?? "");
    return html`<select class="pe-sel" @change=${(e: any) => onChange(e.target.value)}>
      ${options.map((o) => html`<option value=${o.value}
        .selected=${String(o.value) === String(match)}>${o.label}</option>`)}
    </select>`;
  }
  // Dropdown options from a device number entity's own min/max/step (so the plan
  // editor's Temp/Humidity/CO2/dead-zone ranges match the Environment tiles).
  private envOptsFor(field: string): { label: string; value: string }[] {
    const e = this.get(`number.sf_${this.config.panel}_${field}`);
    const min = Number(e?.attributes?.min ?? 0);
    const max = Number(e?.attributes?.max ?? 100);
    const step = Number(e?.attributes?.step ?? 1) || 1;
    const unit = e?.attributes?.unit_of_measurement ?? "";
    return this.numOpts(min, max, step, (n) => `${n}${unit}`);
  }
  // epoch <-> "YYYY-MM-DDTHH:MM" for the alarm reminder datetime-local input.
  private epochToLocalInput(epoch: any): string {
    const n = Number(epoch);
    if (!Number.isFinite(n) || n <= 0) return "";
    const d = new Date(n * 1000);
    const p = (x: number) => String(x).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  }
  private localInputToEpoch(s: string): number | undefined {
    const m = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(s || "");
    if (!m) return undefined;
    return Math.floor(new Date(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]).getTime() / 1000);
  }
  // Go-dark / turn-off thresholds: device stores °C (0 = off). Show in the tile
  // dropdown units; "Off" = 0.
  private threshToDisp(c: any): string {
    const n = Number(c);
    if (!Number.isFinite(n) || n === 0) return "0";
    return String(this.tempUnitF() ? Math.round(n * 9 / 5 + 32) : Math.round(n));
  }
  private threshToC(v: any): number {
    const n = Number(v);
    if (!Number.isFinite(n) || n === 0) return 0;
    return this.tempUnitF() ? Math.round((n - 32) * 5 / 9 * 1e4) / 1e4 : n;
  }
  private threshOpts(): { label: string; value: string }[] {
    const f = this.tempUnitF();
    const u = f ? "°F" : "°C";
    return [{ label: "Off", value: "0" },
      ...this.numOpts(f ? 59 : 15, f ? 122 : 50, 1, (n) => `${n}${u}`)];
  }
  private durText(start: string, stop: string): string {
    const a = /^(\d{2}):(\d{2})/.exec(start || ""), b = /^(\d{2}):(\d{2})/.exec(stop || "");
    if (!a || !b) return "";
    let mins = ((+b[1] * 60 + +b[2]) - (+a[1] * 60 + +a[2]) + 1440) % 1440;
    if (mins === 0 && start === stop) mins = 0;
    const h = Math.floor(mins / 60), m = mins % 60;
    return `${h}h ${String(m).padStart(2, "0")}m`;
  }
  // "H:MMhrs" on-duration for the device tile summary (e.g. "18:00hrs"), shown on
  // its own line under the schedule.
  private hrsText(start: string, stop: string): string {
    const a = /^(\d{1,2}):(\d{2})/.exec(start || ""), b = /^(\d{1,2}):(\d{2})/.exec(stop || "");
    if (!a || !b) return "";
    const mins = ((+b[1] * 60 + +b[2]) - (+a[1] * 60 + +a[2]) + 1440) % 1440;
    return `${Math.floor(mins / 60)}:${String(mins % 60).padStart(2, "0")}hrs`;
  }

  private startPlanEdit(fresh = false) {
    const isF = this.tempUnitF();
    const c = (v: any) => {
      const n = Number(v);
      if (v == null || v === "" || !Number.isFinite(n)) return "";
      return isF ? Math.round(n * 9 / 5 + 32) : Math.round(n * 10) / 10;
    };
    const dz = (v: any) => {
      const n = Number(v);
      if (v == null || v === "" || !Number.isFinite(n)) return "";
      return isF ? Math.round(n * 9 / 5) : Math.round(n * 10) / 10;
    };
    const defLight = () => ({
      mode: "Time Slot", ts_start: "05:00", ts_stop: "23:00", ts_bri: 100, ts_fade: 0,
      ppfd_target: 300, ppfd_start: "05:00", ppfd_stop: "23:00", ppfd_fade: 0,
      ppfd_min: 11, ppfd_max: 100, go_dark: 0, turn_off: 0,
    });
    const blank = () => ({
      stageId: null, label: "New stage", start: "", end: "", alarm: "",
      temp_day: "", temp_night: "", temp_dz: "", humi_day: "", humi_night: "",
      humi_dz: "", co2_day: "", co2_night: "", co2_dz: "",
      light1: defLight(), light2: defLight(),
    });
    if (fresh) { this.planDraft = [blank()]; this.planEditStage = 0; return; }
    const lite = (L: any) => L ? {
      ...L, go_dark: this.threshToDisp(L.go_dark), turn_off: this.threshToDisp(L.turn_off),
    } : null;
    this.planDraft = this.planInfo().stages.map((s: any) => ({
      stageId: s.stageId, label: s.label || "",
      start: this.codeToInputDate(s.start), end: this.codeToInputDate(s.end),
      alarm: this.epochToLocalInput(s.alarm),
      temp_day: c(s.temp_day), temp_night: c(s.temp_night), temp_dz: dz(s.temp_dz),
      humi_day: s.humi_day ?? "", humi_night: s.humi_night ?? "", humi_dz: s.humi_dz ?? "",
      co2_day: s.co2_day ?? "", co2_night: s.co2_night ?? "", co2_dz: s.co2_dz ?? "",
      light1: lite(s.light1) ?? defLight(), light2: lite(s.light2),
    }));
  }
  private planDraftSet(i: number, key: string, val: any) {
    if (!this.planDraft) return;
    this.planDraft = this.planDraft.map((s, idx) => idx === i ? { ...s, [key]: val } : s);
  }
  private addPlanStage() {
    if (!this.planDraft) this.startPlanEdit();   // seed the draft from current stages
    const dl = () => ({
      mode: "Time Slot", ts_start: "05:00", ts_stop: "23:00", ts_bri: 100, ts_fade: 0,
      ppfd_target: 300, ppfd_start: "05:00", ppfd_stop: "23:00", ppfd_fade: 0,
      ppfd_min: 11, ppfd_max: 100, go_dark: 0, turn_off: 0,
    });
    const s = {
      stageId: null, label: "New stage", start: "", end: "", alarm: "",
      temp_day: "", temp_night: "", temp_dz: "", humi_day: "", humi_night: "",
      humi_dz: "", co2_day: "", co2_night: "", co2_dz: "",
      light1: dl(), light2: null,
    };
    const base = this.planDraft ?? [];
    this.planDraft = [...base, s];
    this.planEditStage = base.length;   // open the new stage for editing
  }
  private removePlanStage(i: number) {
    if (!this.planDraft) return;
    this.planDraft = this.planDraft.filter((_, idx) => idx !== i);
    this.planEditStage = null;
    this.savePlanEdit(this.planInfo().active);
  }
  private savePlanEdit(enabled: boolean) {
    if (!this.planDraft) return;
    const isF = this.tempUnitF();
    const num = (v: any) => {
      const n = Number(v);
      return (v === "" || v == null || !Number.isFinite(n)) ? undefined : n;
    };
    const toC = (v: any) => {
      const n = num(v); if (n === undefined) return undefined;
      return isF ? Math.round((n - 32) * 5 / 9 * 1e4) / 1e4 : n;
    };
    const dzC = (v: any) => {
      const n = num(v); if (n === undefined) return undefined;
      return isF ? Math.round(n * 5 / 9 * 1e4) / 1e4 : n;
    };
    const light = (L: any) => {
      if (!L) return undefined;
      return { ...L, go_dark: this.threshToC(L.go_dark), turn_off: this.threshToC(L.turn_off) };
    };
    const stages = this.planDraft.map((s: any) => {
      const start = this.encodePlanCode(s.start);
      const end = this.encodePlanCode(s.end);
      // Alarm reminder: an explicit datetime, else default to the start date noon.
      let alarm = this.localInputToEpoch(s.alarm);
      if (alarm === undefined) {
        const sd = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.start || "");
        if (sd) alarm = Math.floor(new Date(+sd[1], +sd[2] - 1, +sd[3], 12, 0, 0).getTime() / 1000);
      }
      const t: any = {};
      const put = (metric: string, day: any, night: any, dead: any) => {
        const b: any = {};
        if (day !== undefined) b.day = day;
        if (night !== undefined) b.night = night;
        if (dead !== undefined) b.dz = dead;
        if (Object.keys(b).length) t[metric] = b;
      };
      // The controller requires every part in the plan or it rejects the write.
      // When this device has no sensor for a metric the editor hides that row,
      // so the user can't (and shouldn't have to) enter it — fill a sane default
      // (native units) so the write stays complete. A value already in the draft
      // (e.g. from a plan the SF app pushed) always wins, so we never clobber it;
      // the metric simply starts showing again if the user adds the sensor.
      const orDef = (converted: any, present: boolean, def: number) =>
        converted !== undefined ? converted : (present ? undefined : def);
      const tempHas = this.planEnvHas("temp");
      const humiHas = this.planEnvHas("humi");
      const co2Has = this.planEnvHas("co2");
      put("temp", orDef(toC(s.temp_day), tempHas, 25), orDef(toC(s.temp_night), tempHas, 20), orDef(dzC(s.temp_dz), tempHas, 2));
      put("humi", orDef(num(s.humi_day), humiHas, 60), orDef(num(s.humi_night), humiHas, 55), orDef(num(s.humi_dz), humiHas, 5));
      put("co2", orDef(num(s.co2_day), co2Has, 500), orDef(num(s.co2_night), co2Has, 500), orDef(num(s.co2_dz), co2Has, 100));
      const out: any = { stageId: s.stageId, label: s.label, start, end, alarm, target: t };
      // Always send both lights — the plan schema carries light1 & light2 even on
      // a controller with no light hardware. A light this device actually has uses
      // the draft (or a sensible default for a new stage); a light it doesn't have
      // is forced off, so a plan pushed from the SF app can't leave a phantom light
      // running on a schedule.
      out.light1 = light(this.planLightHas("light1")
        ? (s.light1 ?? this.defaultPlanLight()) : this.offPlanLight());
      out.light2 = light(this.planLightHas("light2")
        ? (s.light2 ?? this.defaultPlanLight()) : this.offPlanLight());
      return out;
    });
    this.hass?.callService("sf", "set_plan", {
      entity_id: `sensor.sf_${this.config.panel}_plan`, stages, enabled,
    });
    if (enabled) this.setPlanLights(true);   // a running plan drives the light(s)
    this.planDraft = null;
    this.planEditStage = null;
  }
  // A running plan puts the light(s) in "Planting Plan" mode (modeType 1 while the
  // plan is active); stopping returns them to Manual. Matches the SF app, which
  // only offers Manual / Planting Plan for a light while a plan runs. (v0.21.38)
  private setPlanLights(on: boolean) {
    const mode = on ? "PPFD - Plan" : "Manual";
    for (const suf of ["light_1", "light_2"]) {
      const sel = `select.sf_${this.config.panel}_${suf}_mode`;
      if (!this.get(sel)) continue;
      this.hass?.callService("select", "select_option",
        { entity_id: sel, option: mode });
      this.modePick = { ...this.modePick, [sel]: mode };   // hold until confirmed
      // Activate the light for a running plan (setting the mode alone leaves it
      // off); when the plan stops, drop the light back to Manual AND turn it off.
      const lightId = `light.sf_${this.config.panel}_${suf}`;
      if (this.get(lightId)) {
        this.hass?.callService("light", on ? "turn_on" : "turn_off",
          { entity_id: lightId });
      }
    }
  }

  // ── Planting-plan templates ────────────────────────────────────────────────
  // System presets in canonical units (°C, %RH, ppm). Vegetative & Flowering are
  // the exact values captured from the controller; the rest are sensible starts.
  private static PLAN_PRESETS: any[] = [
    { key: "seedling", label: "Seedling cultivation", emoji: "🌱",
      tC: 22.78, tCn: 22.78, tDz: 2.78, hd: 75, hn: 75, hDz: 10, cd: 600, cn: 400, cDz: 200, ppfd: 200, on: "05:00", off: "23:00", fade: 30 },
    { key: "clone", label: "Cloning and seedling", emoji: "🌿",
      tC: 23.89, tCn: 22.22, tDz: 2.78, hd: 75, hn: 75, hDz: 10, cd: 400, cn: 400, cDz: 100, ppfd: 150, on: "05:00", off: "23:00", fade: 30 },
    { key: "veg", label: "Vegetative growth", emoji: "🌿",
      tC: 29.4444, tCn: 23.8889, tDz: 2.7778, hd: 70, hn: 65, hDz: 10, cd: 1000, cn: 500, cDz: 200, ppfd: 600, on: "05:00", off: "23:00", fade: 30 },
    { key: "flower", label: "Flowering period", emoji: "🌸",
      tC: 25, tCn: 22.7778, tDz: 2.7778, hd: 55, hn: 55, hDz: 5, cd: 1000, cn: 400, cDz: 200, ppfd: 900, on: "05:00", off: "17:00", fade: 30 },
    { key: "dry", label: "Dry", emoji: "🍂",
      tC: 15.56, tCn: 15.56, tDz: 1.67, hd: 55, hn: 55, hDz: 5, ppfd: 0 },
  ];
  // Seed a draft stage from a built-in preset, converting temps to the display
  // unit so the editor shows °F on a °F device. Built-in presets are read-only;
  // edits apply to the plan you're building, and can be kept via "Save as template".
  private presetDraftStage(p: any): any {
    const isF = this.tempUnitF();
    const c = (v: number) => isF ? Math.round(v * 9 / 5 + 32) : Math.round(v * 10) / 10;
    const dz = (v: number) => isF ? Math.round(v * 9 / 5) : Math.round(v * 10) / 10;
    const on = () => ({
      mode: "PPFD", ts_start: "05:00", ts_stop: "23:00", ts_bri: 100, ts_fade: 0,
      ppfd_target: p.ppfd ?? 300, ppfd_start: p.on ?? "05:00", ppfd_stop: p.off ?? "23:00",
      ppfd_fade: p.fade ?? 30, ppfd_min: 11, ppfd_max: 100, go_dark: 0, turn_off: 0,
    });
    const off = () => ({
      mode: "Time Slot", ts_start: "00:00", ts_stop: "00:00", ts_bri: 11, ts_fade: 0,
      ppfd_target: 300, ppfd_start: "05:00", ppfd_stop: "23:00", ppfd_fade: 0,
      ppfd_min: 11, ppfd_max: 100, go_dark: 0, turn_off: 0,
    });
    const L = () => (p.key === "dry" ? off() : on());
    return {
      stageId: null, label: p.label, start: "", end: "", alarm: "",
      temp_day: c(p.tC), temp_night: c(p.tCn), temp_dz: dz(p.tDz),
      humi_day: p.hd, humi_night: p.hn, humi_dz: p.hDz,
      co2_day: p.cd ?? "", co2_night: p.cn ?? "", co2_dz: p.cDz ?? "",
      light1: L(), light2: L(),
    };
  }
  // "My templates" (whole plans) persist SERVER-SIDE in the panel's card_options
  // (plan_templates), so they survive reloads, sync across devices, and don't
  // depend on the browser's localStorage (which is often at quota on a busy HA
  // frontend). _myTpl is a same-session cache for instant display after an edit;
  // the old localStorage key is still read once as a migration fallback.
  private static MY_TPL_KEY = "sf-plan-templates";
  private _myTpl: { name: string; stages: any[] }[] | null = null;
  private myTemplates(): { name: string; stages: any[] }[] {
    if (this._myTpl) return this._myTpl;
    const co = this.get(`sensor.sf_${this.config.panel}_alarm_settings`)
      ?.attributes.card_options as Record<string, string> | undefined;
    const raw = co?.plan_templates;
    if (raw) { try { const a = JSON.parse(raw); if (Array.isArray(a)) return a; } catch { /* bad json */ } }
    try { const a = JSON.parse(localStorage.getItem(SpiderFarmerCard.MY_TPL_KEY) || "[]"); return Array.isArray(a) ? a : []; }
    catch { return []; }
  }
  private saveMyTemplate(name: string): void {
    const nm = (name || "").trim();
    if (!this.planDraft || !nm) return;
    const arr = this.myTemplates().filter((t) => t.name !== nm);
    arr.push({ name: nm, stages: JSON.parse(JSON.stringify(this.planDraft)) });
    this._myTpl = arr;                                   // instant, same session
    this.persistColorOption("plan_templates", JSON.stringify(arr));  // durable + cross-device
    this.planTplName = "";
    this._tplMsg = `“${nm}” saved to My templates`;
    clearTimeout(this._tplMsgT);
    this._tplMsgT = setTimeout(() => { this._tplMsg = ""; }, 3000);
  }
  private deleteMyTemplate(name: string): void {
    const arr = this.myTemplates().filter((t) => t.name !== name);
    this._myTpl = arr;
    this.persistColorOption("plan_templates", JSON.stringify(arr));
    this.requestUpdate();
  }
  private usePreset(p: any, append: boolean): void {
    const stage = this.presetDraftStage(p);
    if (append && this.planDraft) {
      this.planDraft = [...this.planDraft, stage]; this.planEditStage = this.planDraft.length - 1;
    } else { this.planDraft = [stage]; this.planEditStage = 0; }
    this.planTplOpen = null;
  }
  private useMyTemplate(name: string, append: boolean): void {
    const t = this.myTemplates().find((x) => x.name === name);
    if (!t) return;
    const clone = JSON.parse(JSON.stringify(t.stages));
    if (append && this.planDraft) this.planDraft = [...this.planDraft, ...clone];
    else this.planDraft = clone;
    this.planEditStage = 0;
    this.planTplOpen = null;
  }
  private renderPlanTemplatePicker() {
    const acc = this.accent();
    const append = this.planTplOpen === "append";
    const tU = this.tempUnitF() ? "°F" : "°C";
    const c = (v: number) => this.tempUnitF() ? Math.round(v * 9 / 5 + 32) : Math.round(v * 10) / 10;
    const my = this.myTemplates();
    const row = (name: string, sub: string, use: () => void, del?: () => void) => html`
      <div style="display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 0;border-bottom:1px solid var(--divider-color,#2a2f31)">
        <div style="display:flex;flex-direction:column;gap:2px;min-width:0">
          <span style="font-weight:600">${name}</span>
          <span style="font-size:12px;color:var(--secondary-text-color)">${sub}</span>
        </div>
        <span style="display:flex;gap:6px;flex:none">
          <button class="plan-editbtn" style="border-color:${acc};color:${acc}" @click=${use}>Use</button>
          ${del ? html`<button class="plan-editbtn" @click=${del}>Delete</button>` : nothing}
        </span>
      </div>`;
    return html`
      <div class="section-label">${append ? "Add a stage from a template" : "New plan from a template"}</div>
      <div style="font-size:12px;color:var(--secondary-text-color);margin:2px 0 4px">System templates</div>
      ${SpiderFarmerCard.PLAN_PRESETS.map((p) => row(
        `${p.emoji} ${p.label}`,
        p.key === "dry" ? "lights off · dark · set dates on apply"
          : `${c(p.tC)}/${c(p.tCn)}${tU} · ${p.hd}/${p.hn}% RH · PPFD ${p.ppfd}`,
        () => this.usePreset(p, append)))}
      <div style="font-size:12px;color:var(--secondary-text-color);margin:12px 0 4px">My templates</div>
      ${my.length
        ? my.map((t) => row(`💾 ${t.name}`, `${t.stages.length} stage${t.stages.length === 1 ? "" : "s"}`,
            () => this.useMyTemplate(t.name, append), () => this.deleteMyTemplate(t.name)))
        : html`<div style="font-size:12px;color:var(--secondary-text-color);padding:6px 0">
            No saved templates yet — build or edit a plan, then “Save as template”.</div>`}
      <button class="plan-btn" style="margin-top:12px" @click=${() => { this.planTplOpen = null; }}>Cancel</button>`;
  }

  private renderStageLight(i: number, which: "light1" | "light2") {
    const acc = this.accent();
    const L = (this.planDraft as any)[i][which];
    if (!L) return nothing;
    const set = (key: string, val: any) => this.planDraftSet(i, which, { ...L, [key]: val });
    const time = (key: string) => html`<input type="time" class="pe-in"
      .value=${String(L[key] ?? "")} @change=${(e: any) => set(key, e.target.value)}>`;
    const sel = (key: string, opts: { label: string; value: string }[]) =>
      this.peSelect(L[key], opts, (v) => set(key, v));
    const modeBtn = (m: string) => html`<button class="pe-modebtn ${L.mode === m ? "on" : ""}"
      style=${L.mode === m ? `border-color:${acc};color:${acc}` : ""}
      @click=${() => set("mode", m)}>${m}</button>`;
    const isPPFD = L.mode === "PPFD";
    const startK = isPPFD ? "ppfd_start" : "ts_start";
    const stopK = isPPFD ? "ppfd_stop" : "ts_stop";
    const dur = this.durText(L[startK], L[stopK]);
    const bri = this.numOpts(11, 100, 1, (n) => `${n}%`);
    const ppfd = this.numOpts(20, 2000, 10, (n) => `${n} µmol`);
    const fade = this.offOpts(1, 60, 1, (n) => `${n} min`);
    const cell = (label: string, ctl: any) => html`<label class="pe-cell">
      <span>${label}</span>${ctl}</label>`;
    const rowN = (cells: any[]) => html`<div class="pe-cellrow">${cells}</div>`;
    const gd = cell("Go dark", sel("go_dark", this.threshOpts()));
    const to = cell("Turn off", sel("turn_off", this.threshOpts()));
    return html`
      <div class="pe-light">
        <div class="pe-light-head"><span>${which === "light1" ? "Light 1" : "Light 2"}</span>
          <span class="pe-modes">${modeBtn("Time Slot")}${modeBtn("PPFD")}</span></div>
        <div class="pe-timesrow">
          <label>On${time(startK)}</label>
          <label>Off${time(stopK)}</label>
        </div>
        ${dur ? html`<div class="pe-durrow">Light Duration · ${dur}</div>` : nothing}
        ${isPPFD ? html`
          ${rowN([cell("Target", sel("ppfd_target", ppfd)), cell("Dim min", sel("ppfd_min", bri)),
            cell("Dim max", sel("ppfd_max", bri)), cell("Sunrise/set", sel("ppfd_fade", fade))])}
          ${rowN([gd, to])}`
        : html`
          ${rowN([cell("Brightness", sel("ts_bri", bri)),
            cell("Sunrise/set", sel("ts_fade", fade)), gd, to])}`}
      </div>`;
  }

  // Single-stage editor (dropdowns matching the device tiles).
  private renderStageEditor(i: number) {
    const acc = this.accent();
    const tU = this.tempUnitF() ? "°F" : "°C";
    const s = (this.planDraft as any)[i];
    const set = (key: string, val: any) => this.planDraftSet(i, key, val);
    const date = (key: string) => html`<input type="date" class="pe-in"
      .value=${String(s[key] ?? "")} @change=${(e: any) => set(key, e.target.value)}>`;
    const trip = (label: string, base: string, valOpts: any, dzOpts: any) => html`
      <div class="pe-row"><span class="pe-lbl">${label}</span>
        <span class="pe-cells">
          ${this.peSelect(s[base + "_night"], valOpts, (v) => set(base + "_night", v))}
          ${this.peSelect(s[base + "_day"], valOpts, (v) => set(base + "_day", v))}
          ${this.peSelect(s[base + "_dz"], dzOpts, (v) => set(base + "_dz", v))}
        </span></div>`;
    return html`
      ${this.planDelArm
        ? html`<div class="pe-head pe-delrow">
            <span class="pe-delq">Delete this stage?</span>
            <button class="pe-del-yes" @click=${() => { this.planDelArm = false; this.removePlanStage(i); }}>Delete</button>
            <button class="pe-del-no" @click=${() => { this.planDelArm = false; }}>Cancel</button>
          </div>`
        : html`<div class="pe-head">
            <ha-icon icon="mdi:arrow-left" class="pe-back"
              @click=${() => { this.planEditStage = null; this.planDelArm = false; }}></ha-icon>
            <input class="pe-name" .value=${s.label || ""}
              @change=${(e: any) => set("label", e.target.value)}>
            <ha-icon icon="mdi:delete" class="pe-del"
              @click=${() => { this.planDelArm = true; }}></ha-icon>
          </div>`}
      <div class="pe-dates">
        <label>Start${date("start")}</label>
        <label>End${date("end")}</label>
      </div>
      <div class="pe-alarmrow">
        <label>Alarm<input type="datetime-local" class="pe-in"
          .value=${String(s.alarm ?? "")}
          @change=${(e: any) => set("alarm", e.target.value)}></label>
      </div>
      <div class="pe-grid-head"><span></span><span class="pe-cells">
        <span>Night</span><span>Day</span><span>Dead</span></span></div>
      ${this.planEnvHas("temp") ? trip("Temp " + tU, "temp", this.envOptsFor("env_temp_day"), this.envOptsFor("env_temp_deadband")) : nothing}
      ${this.planEnvHas("humi") ? trip("Humidity", "humi", this.envOptsFor("env_humi_day"), this.envOptsFor("env_humi_deadband")) : nothing}
      ${this.planEnvHas("co2") ? trip("CO₂", "co2", this.envOptsFor("env_co2_day"), this.envOptsFor("env_co2_deadband")) : nothing}
      ${this.planLightHas("light1") ? this.renderStageLight(i, "light1") : nothing}
      ${this.planLightHas("light2") ? this.renderStageLight(i, "light2") : nothing}
      <div class="plan-actions" style="display:flex;gap:10px">
        <button class="plan-btn" style="flex:1;background:${acc};border-color:${acc};color:#0c1f06"
          @click=${() => this.savePlanEdit(this.planInfo().active)}>${this.planInfo().active ? "Save & activate" : "Save Plan"}</button>
        <button class="plan-btn" style="flex:1"
          @click=${() => { this.planDraft = null; this.planEditStage = null; this.planDelArm = false; }}>Cancel</button>
      </div>
      <div style="display:flex;gap:8px;margin-top:8px;align-items:center">
        <input class="pe-name" style="flex:1;min-width:0" placeholder="Template name"
          .value=${this.planTplName}
          @input=${(e: any) => { this.planTplName = e.target.value; }}>
        <button class="plan-btn" style="flex:0 0 auto;width:auto;padding:11px 14px;white-space:nowrap"
          ?disabled=${!this.planTplName.trim()}
          @click=${() => this.saveMyTemplate(this.planTplName)}>Save as template</button>
      </div>
      ${this._tplMsg ? html`<div style="display:flex;align-items:center;gap:6px;margin-top:8px;
        color:#46c98a;font-size:13px;font-weight:600">
        <ha-icon icon="mdi:check-circle" style="--mdc-icon-size:18px"></ha-icon>${this._tplMsg}</div>` : nothing}
      <div class="plan-note" style="margin-top:6px">
        <ha-icon icon="mdi:information-outline"></ha-icon>
        <span>“Save as template” stores this whole plan under My templates (on the
        controller, so it syncs across your devices) — it doesn't change the running
        plan. Use “${this.planInfo().active ? "Save & activate" : "Save Plan"}” to apply it to the controller.</span>
      </div>`;
  }

  // Open the single-stage editor: build the full draft once, focus stage i.
  private editStage(i: number) {
    if (!this.planDraft) this.startPlanEdit();
    this.planEditStage = i;
    this.planDelArm = false;
  }

  // A plan env metric (temp/humi/co2) is only meaningful if the controller
  // actually reports that sensor — matches the Overview, which hides a metric
  // tile whose sensor entity doesn't exist. Prevents a plan pushed from the SF
  // app (which can carry every metric) from showing e.g. CO₂ on a controller
  // that has no CO₂ probe.
  private planEnvHas(base: "temp" | "humi" | "co2"): boolean {
    const suffix = base === "temp" ? "temperature" : base === "humi" ? "humidity" : "co2";
    return !!this.get(`sensor.sf_${this.config.panel}_${suffix}`);
  }
  // Whether this controller actually has light1 / light2 hardware. A plan pushed
  // from the SF app carries both lights even on a controller with none (e.g. a
  // bare power strip), so the editor hides the missing light but the write-back
  // still sends a default config for it (the controller requires all parts).
  private planLightHas(which: "light1" | "light2"): boolean {
    return !!this.get(this.eid("light", which === "light1" ? "light_1" : "light_2"));
  }
  // Default light config in the editor's display convention (Time Slot 05:00–23:00
  // at 100%). Used to seed new stages and to fill a light the controller requires
  // but this device doesn't physically have.
  private defaultPlanLight() {
    return {
      mode: "Time Slot", ts_start: "05:00", ts_stop: "23:00", ts_bri: 100, ts_fade: 0,
      ppfd_target: 300, ppfd_start: "05:00", ppfd_stop: "23:00", ppfd_fade: 0,
      ppfd_min: 11, ppfd_max: 100, go_dark: 0, turn_off: 0,
    };
  }
  // An off light config, written for a light the controller requires but this
  // device doesn't physically have — so a plan pushed from the SF app can't leave
  // a phantom light on a schedule. Manual (off) with everything off: brightness 0
  // and every dropdown (target / dim min-max / sunrise-set / go dark / turn off)
  // at 0. A sane 5am–11pm lighting period is stored so the times exist if the user
  // later adds a light.
  private offPlanLight() {
    return {
      mode: "Manual", ts_start: "05:00", ts_stop: "23:00", ts_bri: 0, ts_fade: 0,
      ppfd_target: 0, ppfd_start: "05:00", ppfd_stop: "23:00", ppfd_fade: 0,
      ppfd_min: 0, ppfd_max: 0, go_dark: 0, turn_off: 0,
    };
  }

  private renderPlanStage(s: any, currentId: any, idx: number = -1) {
    const acc = this.accent();
    const isCurrent = currentId != null && s.stageId === currentId;
    const dates = this.planStageDates(s);
    const pair = (label: string, night: any, day: any, suffix = "") => html`
      <div class="plan-metric">
        <span class="plan-metric-label">${label}</span>
        <span class="plan-metric-vals">
          <span>N ${this.fmtNum(night)}${suffix}</span>
          <span>D ${this.fmtNum(day)}${suffix}</span>
        </span>
      </div>`;
    // Light row for the active plan stage — same one-line badge layout as the
    // temp/humidity pairs. A plan light is a schedule, not a day/night pair, so
    // the badges are the photoperiod window + intensity (or PPFD target). Only
    // shown for a light this controller physically has. (v0.21.54)
    const lightRow = (label: string, L: any) => {
      if (!L || typeof L !== "object") return nothing;
      const mode = L.mode || "";
      let a = "", b = "";
      if (mode === "Manual") {
        const bri = Number(L.ts_bri) || 0;
        a = bri > 0 ? `${bri}%` : "Off";
      } else if (mode === "PPFD") {
        a = `${L.ppfd_start}–${L.ppfd_stop}`;
        // 20 µmol is the target floor (0/unset isn't a valid PPFD target — on/off
        // is the light toggle). The editor shows this floor as its default, so the
        // overview must too, or an unconfigured stage reads "PPFD 0" here while the
        // editor shows 20. (v0.21.59)
        b = `PPFD ${Math.max(PPFD_TARGET_MIN, Math.round(Number(L.ppfd_target) || 0))}`;
      } else {
        a = `${L.ts_start}–${L.ts_stop}`;
        b = `${Math.round(Number(L.ts_bri) || 0)}%`;
      }
      return html`
        <div class="plan-metric">
          <span class="plan-metric-label">${label}</span>
          <span class="plan-metric-vals">
            ${a ? html`<span>${a}</span>` : nothing}
            ${b ? html`<span>${b}</span>` : nothing}
          </span>
        </div>`;
    };
    const has1 = this.planLightHas("light1");
    const has2 = this.planLightHas("light2");
    return html`
      <div class="plan-stage ${isCurrent ? "current" : ""}"
        style=${isCurrent ? `border-color:${acc}` : ""}>
        <div class="plan-stage-head">
          <span class="plan-stage-dot" style="background:${acc}"></span>
          <span class="plan-stage-name">${s.label || "Stage"}</span>
          ${isCurrent
            ? html`<span class="plan-stage-badge" style="color:${acc};border-color:${acc}">Current</span>`
            : nothing}
          ${idx >= 0 ? html`<ha-icon icon="mdi:pencil" class="plan-stage-edit"
            @click=${() => this.editStage(idx)}></ha-icon>` : nothing}
        </div>
        ${dates ? html`<div class="plan-stage-dates">${dates}</div>` : nothing}
        <div class="plan-stage-grid">
          ${this.planEnvHas("temp") ? pair("Temp", this.fmtTemp(s.temp_night), this.fmtTemp(s.temp_day)) : nothing}
          ${this.planEnvHas("humi") ? pair("Humidity", s.humi_night, s.humi_day, "%") : nothing}
          ${this.planEnvHas("co2") ? pair("CO₂", s.co2_night, s.co2_day, "") : nothing}
          ${has1 ? lightRow(has2 ? "Light 1" : "Light", s.light1) : nothing}
          ${has2 ? lightRow("Light 2", s.light2) : nothing}
        </div>
      </div>`;
  }

  // Stage temps arrive in °C (device native); show them in the same unit the
  // Environment editor uses so day/night targets read consistently.
  private fmtTemp(c: any): string {
    if (c == null || c === "") return "–";
    const n = Number(c);
    if (!Number.isFinite(n)) return "–";
    const e = this.get(`number.sf_${this.config.panel}_env_temp_day`);
    const u = e?.attributes?.unit_of_measurement;
    return (u === "°F" || u === "℉")
      ? `${Math.round(n * 9 / 5 + 32)}°`
      : `${Math.round(n)}°`;
  }
  private fmtNum(v: any): string {
    if (v == null || v === "") return "–";
    const n = Number(v);
    return Number.isFinite(n) ? `${Math.round(n)}` : String(v);
  }

  // Target VPD range (kPa) implied by a temp/humidity setpoint and its dead
  // zones — matches the SF app's "VPD kPa" readout. Highest VPD comes from the
  // hottest + driest corner of the dead band, lowest from coolest + wettest.
  private vpdRangeFor(tempId: string, humiId: string): string | null {
    const te = this.get(tempId);
    const he = this.get(humiId);
    if (!te || !he) return null;
    const t = Number(te.state);
    const h = Number(he.state);
    if (!Number.isFinite(t) || !Number.isFinite(h)) return null;
    const p = this.config.panel;
    const tDz = Number(this.get(`number.sf_${p}_env_temp_deadband`)?.state ?? 0) || 0;
    const hDz = Number(this.get(`number.sf_${p}_env_humi_deadband`)?.state ?? 0) || 0;
    const isC = te.attributes.unit_of_measurement === "°C";
    const toC = (v: number) => (isC ? v : (v - 32) * 5 / 9);
    // Saturation vapour pressure (Tetens), kPa.
    const svp = (tc: number) => 0.6108 * Math.exp((17.27 * tc) / (tc + 237.3));
    const rhLo = Math.max(0, h - hDz);
    const rhHi = Math.min(100, h + hDz);
    const vMin = Math.max(0, svp(toC(t - tDz)) * (1 - rhHi / 100));
    const vMax = Math.max(0, svp(toC(t + tDz)) * (1 - rhLo / 100));
    return `${vMin.toFixed(2)} – ${vMax.toFixed(2)}`;
  }

  private renderVpd() {
    const p = this.config.panel;
    const day = this.vpdRangeFor(`number.sf_${p}_env_temp_day`, `number.sf_${p}_env_humi_day`);
    const night = this.vpdRangeFor(`number.sf_${p}_env_temp_night`, `number.sf_${p}_env_humi_night`);
    if (!day && !night) return nothing;
    return html`
      <div class="env-row">
        <div class="env-row-head">
          <ha-icon icon="mdi:water-opacity" style="color:${this.accent()}"></ha-icon>
          <span>VPD kPa</span>
        </div>
        <div class="vpd-grid">
          ${day
            ? html`<div class="vpd-line">
                <span class="vpd-lbl">Daytime</span>
                <span class="vpd-val">${day}</span>
              </div>`
            : nothing}
          ${night
            ? html`<div class="vpd-line">
                <span class="vpd-lbl">Nighttime</span>
                <span class="vpd-val">${night}</span>
              </div>`
            : nothing}
        </div>
      </div>`;
  }

  // Leaf VPD target bounds (Environment tab). These are local number entities,
  // set live (no device write, so they sit outside the env Apply/Discard flow).
  // They drive the Leaf VPD tile's out-of-range colouring.
  private renderLeafVpdTargets() {
    if (!this.showLeafVpd) return nothing;
    const minE = this.get(this.eid("number", "leaf_vpd_min"));
    const maxE = this.get(this.eid("number", "leaf_vpd_max"));
    if (!minE || !maxE) return nothing;
    // Stage into the draft (not a live write) so the Environment tab's
    // Apply/Discard bar gates it, like every other env control. (v3.19.146)
    const field = (suffix: string, label: string) => {
      const id = this.eid("number", suffix);
      return html`
      <div class="ctl ${id in this.draft ? "staged" : ""}">
        <div class="ctl-label">${label}</div>
        <div class="ctl-input">
          <span class="num-box">
            <input type="number" step="0.05" min="0" max="4" .value=${this.draftVal(id)}
              @change=${(ev: Event) => {
                const n = parseFloat((ev.target as HTMLInputElement).value);
                if (Number.isFinite(n)) this.stage(id, String(n));
              }} />
            <span class="unit">kPa</span>
          </span>
        </div>
      </div>`;
    };
    return html`
      <div class="env-row">
        <div class="env-row-head">
          <ha-icon icon="mdi:leaf" style="color:${this.accent()}"></ha-icon>
          <span>Leaf VPD target</span>
        </div>
        <div class="leaf-tgt-grid">
          ${field("leaf_vpd_min", "Min")}
          ${field("leaf_vpd_max", "Max")}
        </div>
        <div class="set-note" style="margin:8px 2px 0">
          Colours the Leaf VPD tile when it drifts outside this band, using the
          Settings-tab highlight colours.
        </div>
      </div>`;
  }

  private toggleOutlet(key: string | null) {
    this.outletOpen = key;
    this.outletCopyOpen = false;   // reset the copy panels on open/close
    this.outletCopyFromOpen = false;
    this.outletCopySel = {};
  }

  // Outlet numbers present on a strip slot.
  private outletNums(slot: string): number[] {
    const nums: number[] = [];
    for (let n = 1; n <= MAX_OUTLETS; n++) {
      if (this.get(`select.sf_${slot}_outlet_${n}_mode`)) nums.push(n);
    }
    return nums;
  }

  // Display label for an outlet: the user's custom name when the feature is on
  // and a name is set, otherwise the default "Outlet N".
  private outletName(slot: string, n: number): string {
    if (this.customOutletNames) {
      const nm = this.outletNames[`${slot}_${n}`];
      if (nm && nm.trim()) return nm.trim();
    }
    return `Outlet ${n}`;
  }
  // Stage an outlet-name edit into the draft (committed on Apply, dropped on
  // Discard — same as the outlet's other controls).
  private stageOutletName(slot: string, n: number, raw: string): void {
    this.outletNameDraft = { ...this.outletNameDraft, [`${slot}_${n}`]: raw };
  }
  // True when the staged name differs from the saved one.
  private outletNameDirty(slot: string, n: number): boolean {
    const k = `${slot}_${n}`;
    return k in this.outletNameDraft
      && this.outletNameDraft[k].trim() !== (this.outletNames[k] ?? "").trim();
  }
  private clearOutletNameDraft(slot: string, n: number): void {
    const k = `${slot}_${n}`;
    if (!(k in this.outletNameDraft)) return;
    const rest = { ...this.outletNameDraft };
    delete rest[k];
    this.outletNameDraft = rest;
  }
  // Commit the staged name to the per-panel card option (empty clears it).
  private commitOutletName(slot: string, n: number): void {
    const k = `${slot}_${n}`;
    if (!(k in this.outletNameDraft)) return;
    const name = this.outletNameDraft[k].trim();
    const next = { ...this.outletNames };
    if (name) next[k] = name; else delete next[k];
    this.outletNames = next;
    this.persistColorOption(`outlet_name_${slot}_${n}`, name);
    this.cacheColors();
    this.clearOutletNameDraft(slot, n);
  }

  // Right-side pills on a strip's name bar (replaces the old indicator-light
  // toggle): an Outlet Mode pill (Standalone/Smart) and a Status Light pill (the
  // indicator LED). Both are quick-toggle-style (.oq-btn) and flip on tap.
  private stripBarPills(slot: string) {
    const pills: unknown[] = [];
    // Operating Mode — Standalone/Smart (psmode), shown first. Driven by the
    // integration's select (only ps5/ps10 strips report psmode), so it appears
    // only where that entity exists. Green/lit = Smart (cloud/app-managed).
    // Entity id follows the display name "Operating Mode" (the integration slugs
    // entity_ids from the name): sf_<slot>_operating_mode. (v0.21.71)
    const modeId = `select.sf_${slot}_operating_mode`;
    const modeE = this.get(modeId);
    if (modeE) {
      const mode = modeE.state;
      const smart = mode === "Smart";
      const other = smart ? "Standalone" : "Smart";
      pills.push(html`<button class="oq-btn ${smart ? "live" : ""}"
        title=${`Operating Mode — tap to switch to ${other}`}
        aria-label=${`Operating Mode: ${mode}`}
        @click=${() => this.hass?.callService("select", "select_option",
          { entity_id: modeId, option: other })}>
        <span class="oq-dot"></span>${mode}</button>`);
    }
    // Indicator Light — the status LED (existing switch), to the right of mode.
    const ledId = `switch.sf_${slot}_indicator_light`;
    const ledE = this.get(ledId);
    if (ledE) {
      const on = ledE.state === "on";
      pills.push(html`<button class="oq-btn ${on ? "live" : ""}"
        title="Status LED (tap to toggle)" aria-label="Status LED"
        @click=${() => this.hass?.callService("switch", "toggle", { entity_id: ledId })}>
        <span class="oq-dot"></span>Status LED</button>`);
    }
    return html`<span style="display:inline-flex;gap:6px">${pills}</span>`;
  }
  private renderOutlets() {
    const slots = this.outletSlots().filter((s) => this.outletNums(s).length > 0);
    if (!slots.length) return nothing;
    return html`
      ${this.outletOnly() ? this.renderEnergyTile() : nothing}
      ${slots.map((slot) => {
        const label = slotDeviceName(this.hass, slot)
          || (slot.startsWith("st") ? "S-Station" : `${slot.toUpperCase()} Power Strip`);
        return html`
          <div class="section-label" style="display:flex;align-items:center;justify-content:space-between;gap:8px">
            <span>${label}</span>
            ${this.stripBarPills(slot)}
          </div>
          ${this.renderQuickRow(slot)}
          <div class="grid">
            ${this.outletNums(slot).map((n) => {
              const key = this.outletKey(slot, n);
              // Open the expansion as a full-width row right UNDER the tapped tile
              // (reflow), matching device/sensor tiles — not at the bottom. (0.21.72)
              return html`${this.outletTile(slot, n)}
                ${this.outletOpen === key
                  ? html`<div class="rspan tile-exp">${this.renderOutletPop()}</div>`
                  : nothing}`;
            })}
          </div>`;
      })}`;
  }

  // ── Outlets Log tab (on/off timeline from switch recorder history) ─────────
  private ologKey(eid: string): string { return `${eid}|${this.ologRange}`; }
  private async fetchOlog(eid: string): Promise<void> {
    const key = this.ologKey(eid);
    if (this._olog[key] || this._ologLoading[key] || !this.hass) return;
    this._ologLoading[key] = true;
    try {
      const end = new Date();
      const start = new Date(end.getTime() - this.ologRange * 3600 * 1000);
      const res: any = await (this.hass as any).callWS({
        type: "history/history_during_period",
        start_time: start.toISOString(), end_time: end.toISOString(),
        entity_ids: [eid], minimal_response: true, no_attributes: true,
      });
      const rows: any[] = (res && res[eid]) || [];
      this._olog[key] = rows.map((r) => ({
        t: r.lu != null ? r.lu * 1000 : Date.parse(r.last_updated ?? r.last_changed),
        on: (r.s ?? r.state) === "on",
      })).filter((p) => Number.isFinite(p.t));
    } catch { this._olog[key] = []; }
    finally { this._ologLoading[key] = false; this._ologVer++; }
  }
  private ologSegments(key: string, s: number, e: number): { left: number; width: number }[] {
    const tr = this._olog[key] || [], span = e - s, segs: { left: number; width: number }[] = [];
    for (let i = 0; i < tr.length; i++) {
      if (!tr[i].on) continue;
      const a = Math.max(tr[i].t, s), b = i + 1 < tr.length ? tr[i + 1].t : e;
      if (b <= a) continue;
      segs.push({ left: (a - s) / span * 100, width: (b - a) / span * 100 });
    }
    return segs;
  }
  private ologEvents(key: string, e: number): { on: boolean; t: number; dur: number | null }[] {
    const tr = this._olog[key] || [], out: { on: boolean; t: number; dur: number | null }[] = [];
    for (let i = tr.length - 1; i >= 0 && out.length < 10; i--) {
      const nxt = i + 1 < tr.length ? tr[i + 1].t : e;
      out.push({ on: tr[i].on, t: tr[i].t, dur: tr[i].on ? nxt - tr[i].t : null });
    }
    return out;
  }
  // Evenly-spaced time labels under the timelines (align with the tick grid).
  // Five marks (oldest → now) scaled to the selected window: days for 7d,
  // hours (or minutes under 1h) for the shorter ranges. (v0.21.74)
  private ologAxis() {
    const r = this.ologRange;
    let marks: string[];
    if (r >= 168) {
      marks = ["7d", "5d", "3d", "1d", "now"];
    } else {
      const fmt = (h: number) => h === 0 ? "now"
        : h < 1 ? `${Math.round(h * 60)}m`
        : Number.isInteger(h) ? `${h}h` : `${h.toFixed(1)}h`;
      marks = [1, 0.75, 0.5, 0.25, 0].map((f) => fmt(r * f));
    }
    return html`<div class="olog-axis">${marks.map((m) => html`<span>${m}</span>`)}</div>`;
  }
  // Subtle vertical gridlines over a timeline track: daily for 7d, otherwise one
  // per hour (6 for the 1h window so it isn't a single line). (v0.21.74)
  private ologTickStyle(): string {
    const r = this.ologRange;
    const n = r >= 168 ? 7 : r <= 1 ? 6 : r;
    const step = (100 / n).toFixed(4);
    const c = "rgba(255,255,255,0.12)";
    return `background-image:repeating-linear-gradient(to right,${c} 0,${c} 1px,transparent 1px,transparent ${step}%)`;
  }
  private ologTime(ms: number): string {
    return new Date(ms).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: this.hour12 });
  }
  private ologDur(ms: number): string {
    const m = Math.round(ms / 60000);
    if (m < 60) return `${m}m`;
    const h = Math.floor(m / 60), mm = m % 60;
    return mm ? `${h}h${mm}m` : `${h}h`;
  }
  private ologAgo(ms: number): string {
    const m = Math.round(ms / 60000);
    if (m < 1) return "just now";
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }
  private ologRow(slot: string, n: number, s: number, e: number) {
    const eid = `switch.sf_${slot}_outlet_${n}`;
    const key = this.ologKey(eid);
    if (!this._olog[key]) this.fetchOlog(eid);
    const okey = this.outletKey(slot, n);
    const open = this.ologOpen === okey;
    const onNow = this.get(eid)?.state === "on";
    const tr = this._olog[key] || [];
    const last = tr.length ? tr[tr.length - 1].t : null;
    const cur = onNow ? "On now" : (last ? `Off · ${this.ologAgo(e - last)}` : "Off");
    const loading = !!this._ologLoading[key] && !this._olog[key];
    const segs = this.ologSegments(key, s, e);
    return html`
      <div class="olog-row" role="button" aria-expanded=${open ? "true" : "false"}
        @click=${() => { this.ologOpen = open ? null : okey; }}>
        <div class="olog-nm">${this.outletName(slot, n)}<span class="olog-cur">${cur}</span></div>
        <div class="olog-tl" style=${this.ologTickStyle()}>
          ${loading ? html`<span class="olog-load">Loading…</span>`
            : segs.map((g) => html`<span class="olog-seg"
                style="left:${g.left.toFixed(2)}%;width:${Math.max(0.4, g.width).toFixed(2)}%"></span>`)}
        </div>
        <ha-icon class="olog-chev" icon=${open ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </div>
      ${open ? html`<div class="olog-exp">
        ${(() => { const evs = this.ologEvents(key, e);
          return evs.length ? evs.map((ev) => html`<div class="olog-ev">
              <span><span class=${ev.on ? "on" : "off"}>${ev.on ? "On" : "Off"}</span> · ${this.ologTime(ev.t)}</span>
              <span class="dur">${ev.dur != null ? this.ologDur(ev.dur) : "—"}</span>
            </div>`)
          : html`<div class="olog-ev" style="color:var(--secondary-text-color)">No switch events in this window.</div>`;
        })()}
      </div>` : nothing}`;
  }
  // ── VPD tab: vibrant temperature × humidity phase grid (+ 24h trend) ───────
  // Phase palette + thresholds sampled from the ha-vpd-chart look: distinct
  // bands, anti-aliased edges (abrupt but not blocky).
  private static VPD_TH = [0.4, 0.8, 1.2, 1.6, 2.0];
  private static VPD_COL: [number, number, number][] = [
    [31, 113, 161], [35, 170, 156], [150, 197, 90], [228, 192, 42], [236, 140, 45], [206, 66, 51],
  ];
  private vpdBand(): [number, number] {
    if (this.vpdPlanSource) {
      const pb = this.vpdPlanBand();
      if (pb) return pb;
    }
    switch (this.vpdStage) {
      case "prop": return [0.4, 0.8];
      case "flower": return [1.2, 1.6];
      case "custom": return this.vpdCustom;
      default: return [0.8, 1.2];
    }
  }
  private vpdPlanBand(): [number, number] | null {
    try {
      const st: any = (this as any).planStageCurrent?.();
      const nm = String(st?.name ?? st?.stageName ?? "").toLowerCase();
      if (!nm) return null;
      if (/seed|clone|prop|germ/.test(nm)) return [0.4, 0.8];
      if (/veg/.test(nm)) return [0.8, 1.2];
      if (/flow|bloom|fruit|dry/.test(nm)) return [1.2, 1.6];
    } catch { /* no plan */ }
    return null;
  }
  private vpdPlanName(): string {
    try {
      const st: any = (this as any).planStageCurrent?.();
      return String(st?.name ?? st?.stageName ?? "");
    } catch { return ""; }
  }
  // Current readings for this panel, or null when temp/humidity aren't reported.
  private vpdReadings(): { airT: number; rh: number; isF: boolean; unit: string;
      air: number; leaf: number; leafT: number } | null {
    const airE = this.get(`sensor.sf_${this.config.panel}_temperature`);
    const rhE = this.get(`sensor.sf_${this.config.panel}_humidity`);
    if (!airE || !rhE) return null;
    const airT = parseFloat(airE.state), rh = parseFloat(rhE.state);
    if (!Number.isFinite(airT) || !Number.isFinite(rh)) return null;
    const unit = (airE.attributes.unit_of_measurement as string) || "°C";
    const isF = /F/i.test(unit);
    const Tc = isF ? (airT - 32) * 5 / 9 : airT;
    const vps = (t: number) => 610.7 * Math.exp(17.27 * t / (t + 237.3)) / 1000;
    const vpAir = vps(Tc) * rh / 100;
    // Leaf VPD: use the integration's own leaf_vpd sensor, which applies the
    // configured day/night leaf offset — so the tab matches the Leaf VPD tile
    // instead of assuming a fixed -2 °C offset. Recover the leaf temperature by
    // inverting SVP (svp(leafC) = leafVpd + vpAir) so the plotted leaf point stays
    // consistent with that value, without re-deriving the offset here. (0.21.72)
    const leafE = this.get(`sensor.sf_${this.config.panel}_leaf_vpd`);
    const leafSensor = leafE ? parseFloat(leafE.state) : NaN;
    let leaf: number, leafC: number;
    if (Number.isFinite(leafSensor)) {
      leaf = leafSensor;
      const u = Math.log(Math.max(0.001, leaf + vpAir) * 1000 / 610.7);
      leafC = 237.3 * u / (17.27 - u);
    } else {
      leafC = Tc - 2;                       // sensor missing — legacy fallback
      leaf = vps(leafC) - vpAir;
    }
    const leafT = isF ? leafC * 9 / 5 + 32 : leafC;
    return { airT, rh, isF, unit, air: vps(Tc) - vpAir, leaf, leafT };
  }
  private async fetchVpdHist(eid: string): Promise<void> {
    if (this._graph[eid] || this._graphLoading[eid] || !this.hass) return;
    this._graphLoading[eid] = true;
    try {
      const end = new Date();
      const start = new Date(end.getTime() - 24 * 3600 * 1000);
      const res: any = await (this.hass as any).callWS({
        type: "history/history_during_period",
        start_time: start.toISOString(), end_time: end.toISOString(),
        entity_ids: [eid], minimal_response: true, no_attributes: true,
      });
      const rows: any[] = (res && res[eid]) || [];
      this._graph[eid] = rows.map((r) => ({
        t: r.lu != null ? r.lu * 1000 : Date.parse(r.last_updated ?? r.last_changed),
        v: parseFloat(r.s ?? r.state),
      })).filter((p) => Number.isFinite(p.v) && Number.isFinite(p.t));
    } catch { this._graph[eid] = []; }
    finally { this._graphLoading[eid] = false; this._graphVer++; }
  }
  private renderVpdTab() {
    const accent = this.accent();
    const r = this.vpdReadings();
    if (!r) {
      return html`<div style="padding:24px 16px;color:var(--secondary-text-color);text-align:center">
        Waiting for this panel's air temperature and humidity…</div>`;
    }
    const band = this.vpdBand();
    const inRange = r.air >= band[0] && r.air <= band[1];
    const chipCol = inRange ? "#46c98a" : (r.air > band[1] ? "#e5734b" : "#52b6d6");
    const chipBg = inRange ? "rgba(70,201,138,.15)" : (r.air > band[1] ? "rgba(229,115,75,.16)" : "rgba(82,182,214,.16)");
    const chipTxt = (inRange ? "In range" : (r.air > band[1] ? "Above target" : "Below target"))
      + ` · ${band[0].toFixed(1)}–${band[1].toFixed(1)} kPa`;
    const planActive = (() => { try { return !!(this as any).planInfo?.().active; } catch { return false; } })();
    const planLocked = this.vpdPlanSource && !!this.vpdPlanBand();
    const seg = (v: "grid" | "trend", label: string) => html`
      <button style="padding:4px 12px;font-size:12px;border:none;cursor:pointer;background:${this.vpdView === v ? accent : "#1a1e20"};color:${this.vpdView === v ? "#151515" : "#aeb4b9"}"
        @click=${() => (this.vpdView = v)}>${label}</button>`;
    const pill = (k: "prop" | "veg" | "flower" | "custom", label: string) => html`
      <button style="padding:5px 9px;border-radius:8px;font-size:12px;white-space:nowrap;cursor:${planLocked ? "default" : "pointer"};
        opacity:${planLocked ? ".45" : "1"};
        background:${this.vpdStage === k && !planLocked ? "rgba(239,139,43,.16)" : "#1e2224"};
        border:1px solid ${this.vpdStage === k && !planLocked ? accent : "#2f3538"};
        color:${this.vpdStage === k && !planLocked ? "#fff" : "#c7cccf"}"
        @click=${() => { if (!planLocked) this.vpdStage = k; }}>${label}</button>`;
    const step = (dir: -1 | 1, idx: 0 | 1) => () => {
      const c: [number, number] = [this.vpdCustom[0], this.vpdCustom[1]];
      if (idx === 0) c[0] = Math.min(c[1] - 0.1, Math.max(0.2, c[0] + dir * 0.05));
      else c[1] = Math.max(c[0] + 0.1, Math.min(2.0, c[1] + dir * 0.05));
      this.vpdCustom = [Math.round(c[0] * 100) / 100, Math.round(c[1] * 100) / 100];
      this.requestUpdate();
    };
    return html`
      <div style="padding:10px 14px 14px">
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:10px">
          <span style="font-size:12px;letter-spacing:.06em;color:var(--secondary-text-color);font-weight:600">VAPOR PRESSURE DEFICIT</span>
          <div style="display:flex;gap:10px;align-items:center">
            <div style="display:flex;border:1px solid #2f3538;border-radius:8px;overflow:hidden">${seg("grid", "Grid")}${seg("trend", "Trend")}</div>
            <span style="font-size:12px;color:#aeb4b9">Highlight</span>
            <button class="toggle ${this.vpdHighlight ? "on" : ""}" style=${this.vpdHighlight ? `background:${accent}` : nothing}
              @click=${() => (this.vpdHighlight = !this.vpdHighlight)}></button>
          </div>
        </div>
        <div style="display:flex;justify-content:center;gap:6px;flex-wrap:wrap;margin-bottom:8px">
          ${pill("prop", "🌱 Propagation")}${pill("veg", "🌿 Vegetative")}${pill("flower", "🌸 Flowering")}${pill("custom", "⚙ Custom")}
        </div>
        <div style="font-size:12px;color:var(--secondary-text-color);margin-bottom:10px;display:flex;justify-content:center;gap:8px;flex-wrap:wrap;align-items:center">
          Target source:
          <span style="color:#c7cccf">${planLocked ? `Planting plan · ${this.vpdPlanName()}` : "Growth-stage buttons"}</span>
          ${this.vpdPlanSource
            ? html`<span style="color:#52b6d6;cursor:pointer;text-decoration:underline dotted"
                @click=${() => (this.vpdPlanSource = false)}>use stage buttons instead →</span>`
            : planActive
              ? html`<span style="color:#52b6d6;cursor:pointer;text-decoration:underline dotted"
                  @click=${() => (this.vpdPlanSource = true)}>use planting plan instead →</span>`
              : html`<span style="color:#5a6166;cursor:default" title="No active planting plan for this device">use planting plan instead →</span>`}
        </div>
        ${this.vpdStage === "custom" && !planLocked ? html`
          <div style="display:flex;align-items:center;gap:10px;margin:0 0 10px;font-size:13px;color:#c7cccf">
            Custom band (kPa):
            <span style="display:flex;align-items:center;gap:6px;background:#1e2224;border:1px solid #2f3538;border-radius:8px;padding:3px 8px">
              min <b style="cursor:pointer;color:${accent}" @click=${step(-1, 0)}>−</b>${this.vpdCustom[0].toFixed(2)}<b style="cursor:pointer;color:${accent}" @click=${step(1, 0)}>+</b></span>
            <span style="display:flex;align-items:center;gap:6px;background:#1e2224;border:1px solid #2f3538;border-radius:8px;padding:3px 8px">
              max <b style="cursor:pointer;color:${accent}" @click=${step(-1, 1)}>−</b>${this.vpdCustom[1].toFixed(2)}<b style="cursor:pointer;color:${accent}" @click=${step(1, 1)}>+</b></span>
          </div>` : nothing}
        <div style="display:flex;justify-content:center;align-items:baseline;gap:12px;margin-bottom:4px;flex-wrap:wrap">
          <div><span style="font-size:26px;font-weight:700">${r.air.toFixed(2)}</span> <span style="font-size:13px;color:var(--secondary-text-color)">kPa air VPD</span></div>
          ${this.vpdLeaf ? html`<div><span style="font-size:20px;font-weight:600;color:#c7cccf">${r.leaf.toFixed(2)}</span> <span style="font-size:12px;color:var(--secondary-text-color)">kPa leaf VPD</span></div>` : nothing}
          <span style="font-size:12px;padding:3px 9px;border-radius:20px;font-weight:600;color:${chipCol};background:${chipBg}">${chipTxt}</span>
        </div>
        <div style="text-align:center;font-size:12px;color:var(--secondary-text-color);margin-bottom:10px">Air ${r.airT.toFixed(1)}${r.unit} · RH ${r.rh.toFixed(0)}%</div>
        <div style="background:#121517;border:1px solid #262b2d;border-radius:10px;padding:8px 6px 4px">
          <canvas id="vpdcanvas" style="width:100%;display:block;border-radius:6px"></canvas>
          ${this.vpdView === "grid" ? html`
            <div style="display:flex;justify-content:center;gap:10px;flex-wrap:wrap;font-size:10.5px;color:#9aa0a4;padding:8px 6px 3px">
              <span><i style="display:inline-block;width:11px;height:11px;border-radius:2px;background:#1f71a1;vertical-align:-1px;margin-right:4px"></i>&lt;0.4</span>
              <span><i style="display:inline-block;width:11px;height:11px;border-radius:2px;background:#23aa9c;vertical-align:-1px;margin-right:4px"></i>0.4–0.8</span>
              <span><i style="display:inline-block;width:11px;height:11px;border-radius:2px;background:#96c55a;vertical-align:-1px;margin-right:4px"></i>0.8–1.2</span>
              <span><i style="display:inline-block;width:11px;height:11px;border-radius:2px;background:#e4c02a;vertical-align:-1px;margin-right:4px"></i>1.2–1.6</span>
              <span><i style="display:inline-block;width:11px;height:11px;border-radius:2px;background:#ec8c2d;vertical-align:-1px;margin-right:4px"></i>1.6–2.0</span>
              <span><i style="display:inline-block;width:11px;height:11px;border-radius:2px;background:#ce4233;vertical-align:-1px;margin-right:4px"></i>≥2.0</span>
            </div>
            <div style="display:flex;justify-content:center;gap:16px;flex-wrap:wrap;font-size:10.5px;color:#9aa0a4;padding:0 6px 4px">
              <span><i style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#fff;border:1px solid #151515;vertical-align:-1px;margin-right:5px"></i>air</span>
              ${this.vpdLeaf ? html`<span><i style="display:inline-block;width:11px;height:11px;border-radius:50%;background:#35e08a;border:1px solid #151515;vertical-align:-1px;margin-right:5px"></i>leaf</span>` : nothing}
            </div>` : nothing}
        </div>
      </div>`;
  }
  private drawVpdCanvas(): void {
    const cv = this.renderRoot?.querySelector("#vpdcanvas") as HTMLCanvasElement | null;
    if (!cv) return;
    const r = this.vpdReadings();
    if (!r) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = Math.max(280, Math.round(cv.clientWidth || 460)), H = 210;
    cv.width = W * dpr; cv.height = H * dpr; cv.style.height = H + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const PL = 32, PR = 10, PT = 22, PB = 10, pw = W - PL - PR, ph = H - PT - PB;
    const band = this.vpdBand();
    const TH = SpiderFarmerCard.VPD_TH, COL = SpiderFarmerCard.VPD_COL, EPS = 0.018;
    const ss = (e0: number, e1: number, x: number) => { const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); };
    const vps = (t: number) => 610.7 * Math.exp(17.27 * t / (t + 237.3)) / 1000;
    if (this.vpdView === "trend") {
      const eid = `sensor.sf_${this.config.panel}_vpd`;
      const pts = this._graph[eid];
      const YMIN = 0.2, YMAX = 2.0;
      const ty = (v: number) => PT + (1 - (v - YMIN) / (YMAX - YMIN)) * ph;
      ctx.strokeStyle = "#242a2c"; ctx.fillStyle = "#8b9298"; ctx.font = "9px sans-serif"; ctx.textAlign = "end"; ctx.lineWidth = 1;
      [0.4, 0.8, 1.2, 1.6].forEach((g) => { const y = ty(g); ctx.beginPath(); ctx.moveTo(PL, y); ctx.lineTo(W - PR, y); ctx.stroke(); ctx.fillText(g.toFixed(1), PL - 5, y + 3); });
      if (this.vpdHighlight) { const yt = ty(Math.min(band[1], YMAX)), yb = ty(Math.max(band[0], YMIN)); ctx.fillStyle = "rgba(70,201,138,.16)"; ctx.fillRect(PL, yt, pw, yb - yt); }
      if (!pts || !this._graph[eid]) { ctx.fillStyle = "#8b9298"; ctx.textAlign = "center"; ctx.fillText("Loading 24h history…", W / 2, H / 2); return; }
      if (pts.length < 2) { ctx.fillStyle = "#8b9298"; ctx.textAlign = "center"; ctx.fillText("Not enough VPD history yet.", W / 2, H / 2); return; }
      const t0 = pts[0].t, t1 = pts[pts.length - 1].t, span = Math.max(1, t1 - t0);
      const tx = (t: number) => PL + (t - t0) / span * pw;
      ctx.beginPath();
      pts.forEach((pt, i) => { const x = tx(pt.t), y = ty(Math.max(YMIN, Math.min(YMAX, pt.v))); if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); });
      ctx.strokeStyle = this.accent(); ctx.lineWidth = 2; ctx.lineJoin = "round"; ctx.stroke();
      const last = pts[pts.length - 1];
      ctx.beginPath(); ctx.arc(tx(last.t), ty(Math.max(YMIN, Math.min(YMAX, last.v))), 4, 0, 7); ctx.fillStyle = this.accent(); ctx.fill();
      ctx.fillStyle = "#8b9298"; ["-24h", "-12h", "now"].forEach((lab, i) => { const x = PL + i / 2 * pw; ctx.textAlign = i === 0 ? "start" : i === 2 ? "end" : "center"; ctx.fillText(lab, x, H - 7); });
      return;
    }
    // Grid: temperature (display unit) × RH, colored by air VPD.
    const isF = r.isF, TMAX = isF ? 90 : 32, TMIN = isF ? 60 : 16, RMIN = 30, RMAX = 90;
    const toC = (x: number) => isF ? (x - 32) * 5 / 9 : x;
    const colAt = (v: number) => {
      const c: [number, number, number] = [COL[0][0], COL[0][1], COL[0][2]];
      for (let k = 0; k < TH.length; k++) { const f = ss(TH[k] - EPS, TH[k] + EPS, v), n = COL[k + 1]; c[0] += (n[0] - c[0]) * f; c[1] += (n[1] - c[1]) * f; c[2] += (n[2] - c[2]) * f; }
      return c;
    };
    const GW = Math.round(pw), GH = Math.round(ph), off = document.createElement("canvas");
    off.width = GW; off.height = GH;
    const octx = off.getContext("2d"); if (!octx) return;
    const img = octx.createImageData(GW, GH), D = img.data;
    for (let py = 0; py < GH; py++) for (let px = 0; px < GW; px++) {
      // humidity high→low left→right; temperature low→high top→bottom
      const rh = RMAX - (px + 0.5) / GW * (RMAX - RMIN), td = TMIN + (py + 0.5) / GH * (TMAX - TMIN), tc = toC(td);
      const v = vps(tc) - vps(tc) * rh / 100, c = colAt(v);
      let rr = c[0], gg = c[1], bb = c[2];
      if (this.vpdHighlight) { const b = ss(band[0] - 0.05, band[0] + 0.02, v) * (1 - ss(band[1] - 0.02, band[1] + 0.05, v)); const dk = (1 - b) * 0.66; rr = rr * (1 - dk) + 18 * dk; gg = gg * (1 - dk) + 21 * dk; bb = bb * (1 - dk) + 23 * dk; }
      const k = (py * GW + px) * 4; D[k] = rr; D[k + 1] = gg; D[k + 2] = bb; D[k + 3] = 255;
    }
    octx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = true; (ctx as any).imageSmoothingQuality = "high";
    ctx.drawImage(off, PL, PT, pw, ph);
    const X = (rh: number) => PL + (RMAX - rh) / (RMAX - RMIN) * pw;   // high RH left
    const Y = (td: number) => PT + (td - TMIN) / (TMAX - TMIN) * ph;   // low temp top
    ctx.fillStyle = "#eef1f2"; ctx.font = "9px sans-serif"; ctx.textAlign = "end";
    const ticks = isF ? [60, 68, 76, 84, 90] : [16, 20, 24, 28, 32];
    ticks.forEach((t) => ctx.fillText(t + "°", PL - 5, Y(t) + 3));
    ctx.textAlign = "center";[90, 75, 60, 45, 30].forEach((rh) => ctx.fillText(rh + "%", X(rh), PT - 7));
    const cx = X(r.rh), cy = Y(r.airT);
    ctx.save(); ctx.setLineDash([3, 4]); ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(PL, cy); ctx.lineTo(W - PR, cy); ctx.moveTo(cx, PT); ctx.lineTo(cx, H - PB); ctx.stroke(); ctx.restore();
    // leaf point = green circle (when enabled), air point = white circle
    if (this.vpdLeaf) { const ly = Y(r.leafT); ctx.beginPath(); ctx.arc(cx, ly, 5, 0, 7); ctx.fillStyle = "#35e08a"; ctx.fill(); ctx.strokeStyle = "#151515"; ctx.lineWidth = 1.3; ctx.stroke(); }
    ctx.beginPath(); ctx.arc(cx, cy, 5, 0, 7); ctx.fillStyle = "#ffffff"; ctx.fill(); ctx.strokeStyle = "#151515"; ctx.lineWidth = 1.3; ctx.stroke();
  }
  protected updated(_changed: PropertyValues): void {
    if (this.tab === "vpd" && this.showVpd) {
      if (this.vpdView === "trend") this.fetchVpdHist(`sensor.sf_${this.config.panel}_vpd`);
      this.drawVpdCanvas();
    }
    // Record any real on<->off transition BEFORE evaluating the pills, so a
    // witnessed off starts the lockout and a reboot (which never yields an
    // on->off here) never does.
    this.trackCooldownTransitions();
    // Drive the dehumidifier cooldown countdown at 1Hz only while it's active.
    const cdActive = this.anyCooldownActive();
    if (cdActive && this._cdTimer === undefined) {
      this._cdTimer = setInterval(() => { this._cdTick++; }, 1000);
    } else if (!cdActive && this._cdTimer !== undefined) {
      clearInterval(this._cdTimer);
      this._cdTimer = undefined;
    }
    // Clear the plan Start/Stop "Please Wait" once the plan sensor reflects the
    // new state (so the next click starts fresh).
    if (this._planPending) {
      const active = this.planInfo().active;
      if ((this._planPending === "start" && active)
          || (this._planPending === "stop" && !active)) {
        this._planPending = "";
        if (this._planPendTimer) {
          clearTimeout(this._planPendTimer);
          this._planPendTimer = undefined;
        }
      }
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._cdTimer !== undefined) {
      clearInterval(this._cdTimer);
      this._cdTimer = undefined;
    }
    if (this._graphTimer != null) {
      clearInterval(this._graphTimer);
      this._graphTimer = null;
    }
    if (this._planPendTimer) {
      clearTimeout(this._planPendTimer);
      this._planPendTimer = undefined;
    }
  }
  private renderOutletsLog() {
    const slots = this.outletSlots().filter((sl) => this.outletNums(sl).length > 0);
    if (!slots.length) return html`<div class="set-note">No outlets on this controller.</div>`;
    const e = Date.now(), s = e - this.ologRange * 3600 * 1000;
    const accent = this.accent();
    const rb = (h: number, label: string) => html`<button class="olog-rb ${this.ologRange === h ? "on" : ""}"
      style=${this.ologRange === h ? `background:${accent};border-color:transparent;color:#fff` : ""}
      @click=${() => { this.ologRange = h; this.persistColorOption("olog_range", String(h)); }}>${label}</button>`;
    return html`
      <div class="olog-range">${rb(1, "1h")}${rb(6, "6h")}${rb(12, "12h")}${rb(24, "24h")}${rb(168, "7d")}</div>
      ${slots.map((slot) => html`
        ${slots.length > 1 ? html`<div class="section-label">${
          slotDeviceName(this.hass, slot) || `${slot.toUpperCase()} Power Strip`}</div>` : nothing}
        ${this.outletNums(slot).map((n) => this.ologRow(slot, n, s, e))}
      `)}
      ${this.ologAxis()}`;
  }

  // ── Device Log tab (on/off timeline per device, reuses the olog machinery) ──
  private renderDeviceLog() {
    const devs = this.overviewDevices();
    if (!devs.length) return html`<div class="set-note">No devices on this controller.</div>`;
    const accent = this.accent();
    const rb = (h: number, label: string) => html`<button class="olog-rb ${this.ologRange === h ? "on" : ""}"
      style=${this.ologRange === h ? `background:${accent};border-color:transparent;color:#fff` : ""}
      @click=${() => { this.ologRange = h; this.persistColorOption("olog_range", String(h)); }}>${label}</button>`;
    return html`
      <div class="olog-range">${rb(1, "1h")}${rb(6, "6h")}${rb(12, "12h")}${rb(24, "24h")}${rb(168, "7d")}</div>
      ${devs.map((d) => this.dlogRow(d))}
      ${this.ologAxis()}`;
  }
  private dlogRow(d: { domain: string; suffix: string; id: string; label: string; icon: string }) {
    const e = Date.now(), s = e - this.ologRange * 3600 * 1000;
    const eid = d.id;
    const key = this.ologKey(eid);
    if (!this._olog[key]) this.fetchOlog(eid);
    const dkey = `${d.domain}:${d.suffix}`;
    const open = this.dlogOpen === dkey;
    const onNow = this.get(eid)?.state === "on";
    const tr = this._olog[key] || [];
    const last = tr.length ? tr[tr.length - 1].t : null;
    const cur = onNow ? "On now" : (last ? `Off · ${this.ologAgo(e - last)}` : "Off");
    const loading = !!this._ologLoading[key] && !this._olog[key];
    const segs = this.ologSegments(key, s, e);
    return html`
      <div class="olog-row" role="button" aria-expanded=${open ? "true" : "false"}
        @click=${() => { this.dlogOpen = open ? null : dkey; }}>
        <div class="olog-nm"><ha-icon icon=${d.icon} style="--mdc-icon-size:15px;margin-right:5px;vertical-align:-3px"></ha-icon>${d.label}<span class="olog-cur">${cur}</span></div>
        <div class="olog-tl" style=${this.ologTickStyle()}>
          ${loading ? html`<span class="olog-load">Loading…</span>`
            : segs.map((g) => html`<span class="olog-seg"
                style="left:${g.left.toFixed(2)}%;width:${Math.max(0.4, g.width).toFixed(2)}%"></span>`)}
        </div>
        <ha-icon class="olog-chev" icon=${open ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </div>
      ${open ? html`<div class="olog-exp">
        ${(() => { const evs = this.ologEvents(key, e);
          return evs.length ? evs.map((ev) => html`<div class="olog-ev">
              <span><span class=${ev.on ? "on" : "off"}>${ev.on ? "On" : "Off"}</span> · ${this.ologTime(ev.t)}</span>
              <span class="dur">${ev.dur != null ? this.ologDur(ev.dur) : "—"}</span>
            </div>`)
          : html`<div class="olog-ev" style="color:var(--secondary-text-color)">No events in this window.</div>`;
        })()}
      </div>` : nothing}`;
  }
  // ── Device quick-toggle row (mirrors the outlet quick row) ─────────────────
  private deviceModeSelectId(d: { domain: string; suffix: string }): string {
    const p = this.config.panel;
    return d.domain === "light" ? `select.sf_${p}_${d.suffix}_mode`
      : `select.sf_${p}_${d.suffix}_mode_set`;
  }
  private dlqRead(suffix: string): { mode: string } | null {
    const co = this.get(`sensor.sf_${this.config.panel}_alarm_settings`)
      ?.attributes.card_options as Record<string, string> | undefined;
    const raw = co?.[`dlq_${suffix}`];
    if (!raw) return null;
    try { const v = JSON.parse(raw); return (v && v.mode) ? v : null; } catch { return null; }
  }
  private dlqHas(suffix: string): boolean {
    const s = this._dlqMem[suffix] || this.dlqRead(suffix);
    return !!(s && s.mode && s.mode !== "Manual");
  }
  private dlqClear(suffix: string): void {
    delete this._dlqMem[suffix];
    const co = this.get(`sensor.sf_${this.config.panel}_alarm_settings`)
      ?.attributes.card_options as Record<string, string> | undefined;
    if (co && co[`dlq_${suffix}`]) this.persistColorOption(`dlq_${suffix}`, "");
  }
  // The active optimistic on/off target for a device suffix, or null if none /
  // expired. Consumers (tile, quick-row) paint this in place of the live state.
  // Device's live level as a percentage (fan speed / light brightness) for confirming
  // the optimistic _pendLevel; -1 if unknown.
  private liveLevelPct(id: string): number {
    const st = this.hass?.states[id];
    if (!st) return -1;
    if (id.startsWith("fan.")) return Math.round(Number(st.attributes.percentage ?? 0));
    if (id.startsWith("light.")) {
      const b = st.attributes.brightness;
      return b != null ? Math.round(Number(b) / 255 * 100) : (st.state === "on" ? 100 : 0);
    }
    return -1;
  }
  private devPend(suffix: string): { on: boolean } | null {
    const p = this._devPend[suffix];
    if (p && p.until > Date.now()) return { on: p.on };
    return null;
  }
  // Start an optimistic on/off window: the tile / quick-row paint `on` right away
  // (hiding both the brief Manual-mode flash on a scheduled power-off and the lag
  // before the device reports a power-on), so the toggle never bounces back.
  // willUpdate drops it as soon as the live state matches; this timeout is the
  // backstop if the change is slow or rejected.
  private markDevPend(suffix: string, on: boolean): void {
    this._devPend = { ...this._devPend, [suffix]: { on, until: Date.now() + 8000 } };
    window.setTimeout(() => {
      const cur = this._devPend[suffix];
      if (cur && cur.until <= Date.now()) {
        const { [suffix]: _drop, ...rest } = this._devPend;
        this._devPend = rest;
      }
    }, 8100);
  }
  // Live on/off for a device suffix from whichever domain entity backs it
  // (climate/switch, light, or fan). null when none is present.
  private deviceLiveOn(suffix: string): boolean | null {
    const p = this.config.panel;
    for (const dom of ["switch", "light", "fan"]) {
      const e = this.get(`${dom}.sf_${p}_${suffix}`);
      if (e) return e.state === "on";
    }
    return null;
  }
  // Optimistic on/off for an OUTLET, keyed by its switch entity id. Same shape as
  // the device pending above — paints the applied state until the live switch
  // catches up so the outlet tile / quick-button don't bounce. (v0.21.68)
  private outPend(id: string): { on: boolean } | null {
    const p = this._outPend[id];
    if (p && p.until > Date.now()) return { on: p.on };
    return null;
  }
  private markOutPend(id: string, on: boolean): void {
    this._outPend = { ...this._outPend, [id]: { on, until: Date.now() + 8000 } };
    window.setTimeout(() => {
      const cur = this._outPend[id];
      if (cur && cur.until <= Date.now()) {
        const { [id]: _drop, ...rest } = this._outPend;
        this._outPend = rest;
      }
    }, 8100);
  }
  // A device counts as "enabled" for the quick-toggle if it's actively running OR
  // it's sitting in a non-Manual (auto/scheduled) mode — so you can quick-toggle it
  // OFF even when its auto mode is currently idle (not running). (Bugs.txt #3)
  private deviceEnabled(d: { domain: string; suffix: string; id: string }): boolean {
    const on = this.get(d.id)?.state === "on";
    const mode = this.deviceMode(d) || "Manual";
    const scheduled = mode !== "Manual" && !!this.get(this.deviceModeSelectId(d));
    return on || scheduled;
  }
  private quickToggleDevice(d: { domain: string; suffix: string; id: string }): void {
    const on = this.get(d.id)?.state === "on";
    const svc = d.domain; // light / fan / switch
    const mode = this.deviceMode(d) || "Manual";
    const modeSel = this.deviceModeSelectId(d);
    const scheduled = mode !== "Manual" && !!this.get(modeSel);
    // Toggle on ENABLED (running or in an auto mode), not just actively running,
    // so an idle auto-mode device can still be quick-toggled off. (#3)
    const enabled = on || scheduled;
    if (enabled) {
      // Remember the current mode (when enabled) so quick-on can restore it.
      if (this.deviceQuickRemember && scheduled) {
        const snap = { mode };
        this._dlqMem[d.suffix] = snap;
        this.persistColorOption(`dlq_${d.suffix}`, JSON.stringify(snap));
      }
      // Render the tile OFF immediately so the Manual-mode step below never
      // flashes on the tile.
      this.markDevPend(d.suffix, false);
      // A device in a scheduled mode (Time Slot / Cycle / …) ignores a bare
      // turn_off — the schedule re-asserts and turns it back on — so drop it to
      // Manual first, then power off (verified live). Manual devices power off
      // directly.
      if (scheduled) {
        this.hass?.callService("select", "select_option", { entity_id: modeSel, option: "Manual" });
        setTimeout(() => this.hass?.callService(svc, "turn_off", { entity_id: d.id }), 400);
      } else {
        this.hass?.callService(svc, "turn_off", { entity_id: d.id });
      }
    } else {
      // Paint the tile ON immediately (optimistic) so quick-on doesn't bounce
      // back while the mode re-select / turn-on round-trips to the device.
      this.markDevPend(d.suffix, true);
      // Restore: re-select the saved mode (the controller re-applies that mode's
      // stored settings); a bare turn_on would land in Manual.
      const snap = this.deviceQuickRemember ? (this._dlqMem[d.suffix] || this.dlqRead(d.suffix)) : null;
      if (snap && snap.mode && snap.mode !== "Manual" && this.get(modeSel)) {
        this.hass?.callService("select", "select_option", { entity_id: modeSel, option: snap.mode });
        this.dlqClear(d.suffix);   // consumed
      } else {
        this.hass?.callService(svc, "turn_on", { entity_id: d.id });
      }
    }
  }
  private renderDeviceQuickRow(force = false) {
    if (!force && !this.showDeviceQuick) return nothing;
    const devs = this.overviewDevices();
    if (!devs.length) return nothing;
    return html`<div class="oq-row">
      <span class="oq-lab"><ha-icon icon="mdi:flash"></ha-icon>
        <span class="oq-lab-lines"><b>Quick</b><span>Devices</span></span></span>
      ${devs.map((d) => {
        const active = this.dlqHas(d.suffix);
        // Lit when enabled (running OR in an auto mode), so an idle auto-mode
        // device still shows as "on" and can be toggled off. (#3) An in-flight
        // optimistic toggle wins so the button doesn't bounce. (v0.21.66)
        const pend = this.devPend(d.suffix);
        const on = pend ? pend.on : this.deviceEnabled(d);
        const cls = active ? "on" : (on ? "live" : "");
        return html`<button class="oq-btn ${cls}"
          title=${d.label} aria-label=${d.label}
          @click=${() => this.quickToggleDevice(d)}>
          <ha-icon icon=${d.icon} style="--mdc-icon-size:14px"></ha-icon>${d.label}</button>`;
      })}
    </div>`;
  }

  // ── Apply bar "saving…" feedback ─────────────────────────────────────────
  private applyWithSaving(fn: () => void, watchId?: string): void {
    // Snapshot the entities about to change BEFORE the apply clears the draft, so
    // "Saving…" can hold until one of them actually updates (the value/toggle
    // physically moves). Skip `select.*` — those hold optimistically and would
    // clear instantly. Include the underlying entity of power:/bri:/pct: keys.
    const watch: { id: string; was: string }[] = [];
    const add = (id?: string) => {
      if (id && this.get(id) && !watch.some((w) => w.id === id))
        watch.push({ id, was: this.get(id)?.state ?? "" });
    };
    if (watchId) add(watchId);
    for (const k of Object.keys(this.draft)) {
      const pseudo = k.match(/^(?:power|bri|pct):(.+)$/);
      if (pseudo) { add(pseudo[1]); continue; }
      if (k.includes(":")) continue;                 // other pseudo-keys
      if (/^(number|text|switch|light|fan)\./.test(k)) add(k);   // not select.*
    }
    fn();
    this._saving = true;
    this._savingAt = Date.now();
    this._savingWatch = watch;
    clearTimeout(this._savingT);
    // Hard cap in case the device never reports back.
    this._savingT = setTimeout(() => { this._saving = false; }, 12000);
  }
  private saveBar(
    dirty: boolean, onApply: () => void, onDiscard: () => void,
    extraClass = "", watchId?: string
  ) {
    return commitBar(this.accent(), dirty,
      () => this.applyWithSaving(onApply, watchId), onDiscard, extraClass, this._saving);
  }

  // ── Outlet config snapshot / copy / quick-toggle ─────────────────────────
  // A copyable snapshot of an outlet's mode + its mode-specific config fields
  // (schedule / device-type / cycle timings), read from its device entities.
  private outletSnapshot(slot: string, n: number): { mode: string; config: Record<string, string> } {
    const mode = this.get(`select.sf_${slot}_outlet_${n}_mode`)?.state || "Manual";
    const config: Record<string, string> = {};
    for (const f of (OUTLET_MODE_FIELDS[mode] || [])) {
      for (const dom of ["text", "number", "select", "switch"]) {
        const e = this.get(`${dom}.sf_${slot}_outlet_${n}_${f}`);
        if (e) { config[f] = e.state; break; }
      }
    }
    return { mode, config };
  }
  private copyOutletTo(srcSlot: string, srcN: number, targets: { slot: string; n: number }[]): void {
    const snap = this.outletSnapshot(srcSlot, srcN);
    const periods = snap.mode === "Time Slot" ? this.outletPeriods(srcSlot, srcN) : null;
    for (const t of targets) {
      const modeId = `select.sf_${t.slot}_outlet_${t.n}_mode`;
      this.hass?.callService("sf", "set_outlet_config",
        { entity_id: modeId, mode: snap.mode, config: snap.config });
      if (periods) this.hass?.callService("sf", "set_outlet_schedule", { entity_id: modeId, periods });
      // Copied-in settings supersede any remembered quick-toggle profile.
      this.olqClear(t.slot, t.n);
    }
  }
  private renderOutletCopyPanel(srcSlot: string, srcN: number) {
    // Every outlet strip in the whole instance (not just this card's panel),
    // grouped into a column per strip; the source outlet's strip is first with a
    // "current" tag so it's clear which is which.
    type Tgt = { slot: string; n: number; key: string; name: string; mode: string };
    const all = this.hass ? outletSlots(this.hass) : [];
    const slots = [srcSlot, ...all.filter((s) => s !== srcSlot)]
      .filter((s, i, a) => a.indexOf(s) === i);
    const groups: { slot: string; label: string; current: boolean; items: Tgt[] }[] = [];
    for (const sl of slots) {
      const items: Tgt[] = [];
      for (const m of this.outletNums(sl)) {
        if (sl === srcSlot && m === srcN) continue;
        items.push({
          slot: sl, n: m, key: this.outletKey(sl, m), name: this.outletName(sl, m),
          mode: this.get(`select.sf_${sl}_outlet_${m}_mode`)?.state || "",
        });
      }
      if (items.length) groups.push({
        slot: sl, current: sl === srcSlot,
        label: slotDeviceName(this.hass, sl) || `${sl.toUpperCase()} Power Strip`, items });
    }
    const allTargets = groups.flatMap((g) => g.items);
    const chosen = allTargets.filter((t) => this.outletCopySel[t.key]);
    const srcMode = this.get(`select.sf_${srcSlot}_outlet_${srcN}_mode`)?.state || "Manual";
    return html`<div class="oc-panel">
      <div class="oc-title">Apply ${this.outletName(srcSlot, srcN)}'s settings
        (<span style="color:${this.accent()}">${srcMode}</span>) to:</div>
      ${allTargets.length ? html`<div class="oc-cols">
        ${groups.map((g) => html`<div class="oc-col">
          <div class="oc-colhd">${g.label}${g.current ? html`<span class="oc-cur">current</span>` : nothing}</div>
          ${g.items.map((t) => html`
            <label class="oc-ck">
              <input type="checkbox" .checked=${!!this.outletCopySel[t.key]}
                @change=${(e: Event) => { this.outletCopySel = { ...this.outletCopySel, [t.key]: (e.target as HTMLInputElement).checked }; }}>
              <span>${t.name}${t.mode ? html` <span class="oc-mode">· ${t.mode}</span>` : nothing}</span>
            </label>`)}
        </div>`)}
      </div>` : html`<div class="oc-mode">No other outlets.</div>`}
      <button class="oc-apply" ?disabled=${chosen.length === 0}
        @click=${() => {
          this.applyWithSaving(() => this.copyOutletTo(srcSlot, srcN,
            chosen.map((t) => ({ slot: t.slot, n: t.n }))));
          this.outletCopyOpen = false; this.outletCopySel = {};
        }}>Apply to ${chosen.length} outlet${chosen.length === 1 ? "" : "s"}</button>
    </div>`;
  }
  // "Copy from…": pick one source outlet (across every strip) and pull its mode +
  // config into the current outlet. Single-click applies and closes.
  private renderOutletCopyFromPanel(destSlot: string, destN: number) {
    type Src = { slot: string; n: number; name: string; mode: string };
    const all = this.hass ? outletSlots(this.hass) : [];
    const slots = [destSlot, ...all.filter((s) => s !== destSlot)]
      .filter((s, i, a) => a.indexOf(s) === i);
    const groups: { slot: string; label: string; current: boolean; items: Src[] }[] = [];
    for (const sl of slots) {
      const items: Src[] = [];
      for (const m of this.outletNums(sl)) {
        if (sl === destSlot && m === destN) continue;
        items.push({ slot: sl, n: m, name: this.outletName(sl, m),
          mode: this.get(`select.sf_${sl}_outlet_${m}_mode`)?.state || "" });
      }
      if (items.length) groups.push({
        slot: sl, current: sl === destSlot,
        label: slotDeviceName(this.hass, sl) || `${sl.toUpperCase()} Power Strip`, items });
    }
    const anySrc = groups.some((g) => g.items.length);
    return html`<div class="oc-panel">
      <div class="oc-title">Copy settings into ${this.outletName(destSlot, destN)} from:</div>
      ${anySrc ? html`<div class="oc-cols">
        ${groups.map((g) => html`<div class="oc-col">
          <div class="oc-colhd">${g.label}${g.current ? html`<span class="oc-cur">current</span>` : nothing}</div>
          ${g.items.map((t) => html`
            <button class="oc-fromitem"
              @click=${() => {
                this.applyWithSaving(() => this.copyOutletTo(t.slot, t.n, [{ slot: destSlot, n: destN }]));
                this.outletCopyFromOpen = false;
              }}>${t.name}${t.mode ? html` <span class="oc-mode">· ${t.mode}</span>` : nothing}</button>`)}
        </div>`)}
      </div>` : html`<div class="oc-mode">No other outlets.</div>`}
    </div>`;
  }
  private outletRememberKey(slot: string, n: number): string {
    return `sf-olq-${this.config.panel}-${slot}-${n}`;
  }
  // Read a persisted quick-toggle snapshot from the panel's card_options (durable,
  // cross-device). Returns null when none is stored or it can't be parsed.
  private olqRead(slot: string, n: number): { mode: string; config: Record<string, string>; periods?: any } | null {
    const co = this.get(`sensor.sf_${this.config.panel}_alarm_settings`)
      ?.attributes.card_options as Record<string, string> | undefined;
    const raw = co?.[`olq_${slot}_${n}`];
    if (!raw) return null;
    try { const v = JSON.parse(raw); return (v && v.mode) ? v : null; } catch { return null; }
  }
  // True when a valid (non-Manual) quick-toggle profile is stored for this outlet.
  private olqHas(slot: string, n: number): boolean {
    const s = this._olqMem[this.outletRememberKey(slot, n)] || this.olqRead(slot, n);
    return !!(s && s.mode && s.mode !== "Manual");
  }
  // Clear a stored quick-toggle profile (memory + server). Called when the outlet
  // is changed by any means other than a quick-toggle (manual mode/power edit,
  // copy-to), and after a quick-on consumes it — so the badge never goes stale.
  private olqClear(slot: string, n: number): void {
    delete this._olqMem[this.outletRememberKey(slot, n)];
    const co = this.get(`sensor.sf_${this.config.panel}_alarm_settings`)
      ?.attributes.card_options as Record<string, string> | undefined;
    if (co && co[`olq_${slot}_${n}`]) this.persistColorOption(`olq_${slot}_${n}`, "");
  }
  private quickToggle(slot: string, n: number): void {
    const eid = `switch.sf_${slot}_outlet_${n}`;
    const on = this.get(eid)?.state === "on";
    // Paint the target state immediately so the quick-button / tile don't bounce.
    this.markOutPend(eid, !on);
    if (!this.outletQuickRemember) {
      this.hass?.callService("switch", "toggle", { entity_id: eid });
      return;
    }
    const rk = this.outletRememberKey(slot, n);
    if (on) {
      // Remember the outlet's current mode/config (plus Time Slot periods), then
      // switch it off. Cache in memory for this session AND persist to the panel's
      // card_options so it survives reloads and syncs to your other devices.
      const snap: any = this.outletSnapshot(slot, n);
      if (snap.mode === "Time Slot") snap.periods = this.outletPeriods(slot, n);
      this._olqMem[rk] = snap;
      this.persistColorOption(`olq_${slot}_${n}`, JSON.stringify(snap));
      this.hass?.callService("switch", "turn_off", { entity_id: eid });
    } else {
      // Restore the remembered mode/config: memory first, then the server copy
      // (which is what makes restore work on another device / after a reload).
      const snap = this._olqMem[rk] || this.olqRead(slot, n);
      if (snap && snap.mode && snap.mode !== "Manual") {
        // Applying a scheduled mode (Cycle/Time Slot/Temperature/…) re-engages the
        // outlet on its own — do NOT also call switch.turn_on, which sends a bare
        // manual-on command and would reset the outlet back to Manual mode.
        const modeId = `select.sf_${slot}_outlet_${n}_mode`;
        this.hass?.callService("sf", "set_outlet_config",
          { entity_id: modeId, mode: snap.mode, config: snap.config });
        if (snap.periods)
          this.hass?.callService("sf", "set_outlet_schedule", { entity_id: modeId, periods: snap.periods });
        // Consumed — clear so the "Quick Toggle Active" badge doesn't linger.
        this.olqClear(slot, n);
      } else {
        // No remembered mode (or it was Manual) — plain manual-on.
        this.hass?.callService("switch", "turn_on", { entity_id: eid });
      }
    }
  }
  private renderQuickRow(slot: string, force = false) {
    if (!force && !this.showOutletQuick) return nothing;
    const nums = this.outletNums(slot);
    if (!nums.length) return nothing;
    return html`<div class="oq-row">
      <span class="oq-lab"><ha-icon icon="mdi:flash"></ha-icon>
        <span class="oq-lab-lines"><b>Quick</b><span>Outlets</span></span></span>
      ${nums.map((n) => {
        // "on"   = a saved quick-toggle profile is active (quick-off'd, restorable) →
        //          green dot (profile-active look).
        // "live" = outlet is simply on with no saved profile → green dot + green
        //          number (a plain "it's on" indicator).
        const active = this.olqHas(slot, n);
        const _qb = `switch.sf_${slot}_outlet_${n}`;
        const _qp = this.outPend(_qb);
        const on = _qp ? _qp.on : this.get(_qb)?.state === "on";
        const cls = active ? "on" : (on ? "live" : "");
        // Names toggle on → show "N-Name" (or just N when unnamed); off → dot + N.
        const nm = this.outletQuickNames && this.customOutletNames
          ? (this.outletNames[`${slot}_${n}`] || "").trim() : "";
        return html`<button class="oq-btn ${cls}"
          title=${this.outletName(slot, n)} aria-label=${this.outletName(slot, n)}
          @click=${() => this.quickToggle(slot, n)}>${this.outletQuickNames
            ? html`${nm ? `${n}-${nm}` : String(n)}`
            : html`<span class="oq-dot"></span>${n}`}</button>`;
      })}
    </div>`;
  }

  // Compact outlet tile: name + plug icon + On/Off + mode. Click expands its
  // controls (power, mode, mode config) in the pop below the grid.
  // The colour for an outlet's mode group (Settings → Outlet active color).
  private outletColorFor(mode: string): string {
    switch (outletGroup(mode)) {
      case "sched": return this.ocSched;
      case "env": return this.ocEnv;
      case "drip": return this.ocDrip;
      default: return this.ocManual;
    }
  }
  // Second tile line describing the *current* mode in full, like the device
  // tiles: env modes show their device direction (Heating/Cooling, Humidifying/
  // Dehumidifying, Aeration/Exhaust); scheduled modes show a schedule summary.
  // Returns null for Manual (and anything with no detail yet).
  private outletModeDetail(slot: string, n: number, mode: string):
    { text: string; cls: string } | null {
    const pre = `sf_${slot}_outlet_${n}`;
    const g = (id: string) => this.get(id)?.state ?? "";
    const pick = this.dirPick[`${slot}_${n}`] || "";
    if (mode === "Light Env") {
      const d = pick || this.outletLightDir[`${slot}_${n}`] || "Day";
      return d === "Night"
        ? { text: "Night", cls: "od-night" }
        : { text: "Day", cls: "od-day" };
    }
    if (mode === "Temperature") {
      const d = g(`select.${pre}_temp_device`) || pick;
      if (d === "Heating") return { text: "Heating", cls: "od-heat" };
      if (d === "Cooling") return { text: "Cooling", cls: "od-cool" };
      return null;
    }
    if (mode === "Humidity") {
      const d = g(`select.${pre}_humidity_device`) || pick;
      if (d === "Humidifying") return { text: "Humidifying", cls: "od-hum" };
      if (d === "Dehumidifying") return { text: "Dehumidifying", cls: "od-dehum" };
      return null;
    }
    if (mode === "CO2") {
      const d = g(`select.${pre}_co2_device`);
      if (d === "Aeration") return { text: "Aeration", cls: "od-aer" };
      if (d === "Exhaust") return { text: "Exhaust", cls: "od-exh" };
      return null;
    }
    if (mode === "Time Slot") {
      const ps = this.outletPeriods(slot, n);
      if (ps.length) {
        const p0 = ps[0];
        const win = `${this.fmtClock(p0.start)}–${this.fmtClock(p0.end)}`;
        return { text: ps.length > 1 ? `${win} +${ps.length - 1}` : win, cls: "od-sched" };
      }
      const a = g(`text.${pre}_ts_start`), b = g(`text.${pre}_ts_stop`);
      if (a && b) return { text: `${this.fmtClock(a)}–${this.fmtClock(b)}`, cls: "od-sched" };
      return null;
    }
    if (mode === "Cycle") {
      const mins = (v: string) => {
        const x = Number(v);
        return Number.isFinite(x) && x >= 60 && x % 60 === 0 ? `${x / 60}h` : `${x}m`;
      };
      const run = g(`number.${pre}_cycle_run`), off = g(`number.${pre}_cycle_off`);
      if (run && off) {
        let t = `${mins(run)} on · ${mins(off)} off`;
        const times = g(`number.${pre}_cycle_times`);
        if (times && Number(times) > 1) t += ` · ×${Math.round(Number(times))}`;
        const start = g(`text.${pre}_cycle_start`);
        if (start && start !== "00:00") t += ` @ ${this.fmtClock(start)}`;
        return { text: t, cls: "od-sched" };
      }
      return null;
    }
    return null;   // Manual / Drip Irrigation → no extra line
  }
  private outletTile(slot: string, n: number) {
    // The tile's On/Off must follow the REAL device — a staged (not-yet-applied)
    // Power toggle in the open pop must NOT make the tile look switched before
    // Apply (the outlet only changes on Apply). A staged MODE edit still previews
    // in the sub-label below. (v0.21.84)
    const _obase = `switch.sf_${slot}_outlet_${n}`;
    const _opend = this.outPend(_obase);
    // Post-Apply optimistic paint wins (so it doesn't bounce after the draft
    // clears); otherwise the live switch state. The staged Power draft is ignored.
    const on = _opend ? _opend.on : this.get(_obase)?.state === "on";
    const mode = this.draftVal(`select.sf_${slot}_outlet_${n}_mode`) || "";
    const key = this.outletKey(slot, n);
    const open = this.outletOpen === key;
    const accent = this.accent();
    // Active-outlet colouring by mode: "off" keeps the accent look; "text"
    // colours the On text + plug; "tile" also tints the tile.
    const oc = on && this.outletColorMode !== "off" ? this.outletColorFor(mode) : "";
    const fg = oc || accent;
    let tileStyle = "";
    if (oc && this.outletColorMode === "tile")
      tileStyle = `background:${tint(oc)};box-shadow:inset 0 0 0 1px ${oc}`;
    if (open) tileStyle = `box-shadow:inset 0 0 0 1px ${accent}`
      + (oc && this.outletColorMode === "tile" ? `;background:${tint(oc)}` : "");
    return html`
      <div class="tile tile-outlet clickable ${open ? "active" : ""}"
        style=${tileStyle || nothing}
        role="button" aria-expanded=${open ? "true" : "false"}
        @click=${() => this.toggleOutlet(open ? null : key)}>
        <div class="tile-label" title=${this.outletName(slot, n)}>${this.outletName(slot, n)}
          <ha-icon class="tile-more"
            icon=${open ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
        </div>
        <ha-icon icon="mdi:power-socket-us"
          style="color:${on ? fg : "var(--secondary-text-color)"}"></ha-icon>
        <div class="tile-val" style=${on ? `color:${fg}` : nothing}>${on ? "On" : "Off"}</div>
        ${!on ? this.cooldownPill(this.outletCooldown(slot, n), "cd-outlet") : nothing}
        <div class="tile-sub">${mode}</div>
        ${(() => {
          const det = this.outletModeDetail(slot, n, mode);
          return det ? html`<div class="tile-sub2 ${det.cls}">${det.text}</div>` : nothing;
        })()}
        ${!on && this.olqHas(slot, n) ? html`<div class="tile-qta" style="color:${accent}"
          title="Quick-toggle profile saved — quick-on restores this outlet's mode">
          <div class="l1">Quick Toggle</div><div class="l2">Active</div></div>` : nothing}
      </div>`;
  }

  private clearOutletCfgDraft(slot: string, n: number) {
    const k = this.outletKey(slot, n);
    if (!(k in this.outletCfgDraft)) return;
    const rest = { ...this.outletCfgDraft };
    delete rest[k];
    this.outletCfgDraft = rest;
  }
  // "Light Env" Day/Night picker. No device entity — the integration drives the
  // socket off the environment day-cycle window. Stages into
  // outletCfgDraft.light_device and commits with the outlet's Apply bar.
  private renderLightEnvConfig(slot: string, n: number) {
    const k = this.outletKey(slot, n);
    const d = this.outletCfgDraft[k] ?? {};
    const cur = d.light_device ?? this.outletLightDir[k] ?? "Day";
    const staged = "light_device" in d && d.light_device !== (this.outletLightDir[k] ?? "Day");
    return html`
      <div class="set-note" style="margin-top:6px">
        Follows the environment day/night cycle (from Environment/Planting Plan):
        on during the selected phase, off in the other. The integration drives it.
      </div>
      <div class="dev-row ${staged ? "staged" : ""}">
        <span class="dev-lbl">Follows</span>
        <span class="ctl-input">
          <select @change=${(e: Event) =>
            (this.outletCfgDraft = { ...this.outletCfgDraft,
              [k]: { ...d, light_device: (e.target as HTMLSelectElement).value } })}>
            ${["Day", "Night"].map((o) =>
              html`<option value=${o} ?selected=${cur === o}>${o}</option>`)}
          </select>
        </span>
      </div>`;
  }
  // Local config controls for a mode picked but not yet applied (its device
  // entities don't exist until Apply). Edits stage into outletCfgDraft and commit
  // atomically via sf.set_outlet_config. Defaults mirror the device defaults.
  private renderOutletModeConfig(slot: string, n: number, mode: string) {
    const k = this.outletKey(slot, n);
    const d = this.outletCfgDraft[k] ?? {};
    const set = (field: string, val: string) =>
      this.outletCfgDraft = { ...this.outletCfgDraft, [k]: { ...d, [field]: val } };
    const numRow = (label: string, field: string, def: number, unit: string) => html`
      <div class="dev-row ${field in d ? "staged" : ""}">
        <span class="dev-lbl">${label}</span>
        <span class="num-box">
          <input type="number" min="0" max="1440" .value=${d[field] ?? String(def)}
            @change=${(e: Event) => set(field, (e.target as HTMLInputElement).value)} />
          ${unit ? html`<span class="unit">${unit}</span>` : nothing}
        </span>
      </div>`;
    const timeRow = (label: string, field: string, def: string) => html`
      <div class="dev-row ${field in d ? "staged" : ""}">
        <span class="dev-lbl">${label}</span>
        <span class="num-box">
          <input type="time" .value=${d[field] ?? def}
            @change=${(e: Event) => set(field, (e.target as HTMLInputElement).value)} />
        </span>
      </div>`;
    const selRow = (label: string, field: string, opts: string[]) => html`
      <div class="dev-row ${field in d ? "staged" : ""}">
        <span class="dev-lbl">${label}</span>
        <span class="ctl-input">
          <select @change=${(e: Event) => set(field, (e.target as HTMLSelectElement).value)}>
            ${opts.map((o) => html`<option value=${o}
              ?selected=${(d[field] ?? opts[0]) === o}>${o}</option>`)}
          </select>
        </span>
      </div>`;
    switch (mode) {
      case "Cycle": return html`
        ${timeRow("Start", "cycle_start", "12:00")}
        ${numRow("Run Duration", "cycle_run", 60, "min")}
        ${numRow("Off Duration", "cycle_off", 60, "min")}
        ${numRow("Execution Times", "cycle_times", 1, "")}`;
      case "Temperature": return selRow("Device", "temp_device", ["Heating", "Cooling"]);
      case "Humidity": return selRow("Device", "humidity_device", ["Humidifying", "Dehumidifying"]);
      case "CO2": return selRow("Device", "co2_device", ["Aeration", "Exhaust"]);
      default: return nothing;
    }
  }

  // ── S-Station single-socket "Device Type" (two-level, matches the app) ─────
  // Current Device Type label from the outlet's mode + direction states.
  private stDeviceType(slot: string, n: number): string {
    const g = (s: string) =>
      this.get(`select.sf_${slot}_outlet_${n}_${s}`)?.state || "";
    const mode = this.get(`select.sf_${slot}_outlet_${n}_mode`)?.state || "";
    if (mode === "Light Env") return "Light Env";
    if (mode.startsWith("Blower")) return "Blower";
    if (mode === "Time Slot") return "Timer period";
    if (mode === "Cycle") return "Timer loop";
    if (mode === "Temperature") return g("temp_device") === "Cooling" ? "Cooler" : "Heater";
    if (mode === "Humidity") return g("humidity_device") === "Dehumidifying" ? "Dehumidification" : "Humidification";
    if (mode === "CO2") return g("co2_device") === "Exhaust" ? "Exhaust fan" : "CO2 Injection";
    return "General device";   // Manual / unset
  }
  private stBlowerMode(slot: string, n: number): string {
    return this.get(`select.sf_${slot}_outlet_${n}_mode`)?.state === "Blower (Humidity Priority)"
      ? "Humidity Priority" : "Temperature Priority";
  }
  private renderStationDeviceType(slot: string, n: number) {
    const key = this.outletKey(slot, n);
    const draft = this._stDt[key] ?? {};
    const curType = this.stDeviceType(slot, n);
    const type = draft.type ?? curType;
    const curBlower = this.stBlowerMode(slot, n);
    const blower = draft.blower ?? curBlower;
    const curLight = this.outletLightDir[key] ?? "Day";
    const light = draft.light ?? curLight;
    const modeId = `select.sf_${slot}_outlet_${n}_mode`;
    const set = (patch: { type?: string; blower?: string; light?: string }) =>
      (this._stDt = { ...this._stDt, [key]: { ...draft, ...patch } });
    // General device = Manual: the Power toggle stages into this.draft; a staged
    // on/off that differs from the live switch must arm (and commit via) Apply. The
    // dirty check previously ignored it, so the toggle did nothing. (v0.21.85)
    const base = `switch.sf_${slot}_outlet_${n}`;
    const powerDirty = type === "General device" && base in this.draft
      && this.draft[base] !== this.get(base)?.state;
    const dirty =
      (draft.type !== undefined && draft.type !== curType)
      || (type === "Blower" && draft.blower !== undefined && draft.blower !== curBlower)
      || (type === "Light Env" && draft.light !== undefined && draft.light !== curLight)
      || (type === "Timer loop" && key in this.outletCfgDraft)
      || (type === "Timer period" && key in this.outletDraft)
      || powerDirty
      || this.outletNameDirty(slot, n);   // custom name edit arms Apply too (v0.21.53)
    const apply = () => {
      // Commit a custom-name edit first, on every device type (incl. the Light
      // Env branch below, which returns early). (v0.21.53)
      this.commitOutletName(slot, n);
      // Leaving Light Env: hand the socket back to the device first.
      if (curType === "Light Env" && type !== "Light Env") {
        this.hass?.callService("sf", "set_outlet_env", { entity_id: modeId, enabled: false });
        this.persistColorOption(`oletdir_${key}`, "");
        const dd = { ...this.outletLightDir }; delete dd[key]; this.outletLightDir = dd;
      }
      if (type === "Light Env") {
        // Integration-driven: write Manual to the device, enable the day/night
        // driver, remember the Day/Night choice (server-side + instant tile).
        this.hass?.callService("sf", "set_outlet_config", {
          entity_id: modeId, mode: "Manual", config: {},
        });
        this.applyOutletEnv(slot, n, "Light Env", light);
        this.outletLightDir = { ...this.outletLightDir, [key]: light };
        this.dirPick = { ...this.dirPick, [key]: light };
        this.persistColorOption(`oletdir_${key}`, light);
        this.clearOutletCfgDraft(slot, n);
        const rest = { ...this._stDt }; delete rest[key]; this._stDt = rest;
        this.modePick = { ...this.modePick, [modeId]: "Light Env" };
        return;
      }
      // Re-apply the device-type config only when the type (or its config) changed.
      // A power-only toggle on an unchanged General device must NOT re-send Manual —
      // that would be an extra, needless mode write. (v0.21.85)
      const typeChanged = draft.type !== undefined && draft.type !== curType;
      const cfgChanged = key in this.outletCfgDraft || key in this.outletDraft;
      if (typeChanged || cfgChanged || type !== "General device") {
        const spec = ST_DEVICE_TYPES.find((t) => t.label === type)!;
        let mode = spec.mode;
        let cfg: Record<string, string> = { ...spec.cfg };
        if (type === "Blower") mode = ST_BLOWER_MODE[blower] || spec.mode;
        if (type === "Timer loop") cfg = { ...cfg, ...(this.outletCfgDraft[key] ?? {}) };
        this.hass?.callService("sf", "set_outlet_config", {
          entity_id: modeId, mode, config: cfg,
        });
        if (type === "Timer period") this.saveOutlet(slot, n);   // multi-slot schedule
        this.modePick = { ...this.modePick, [modeId]: mode };
      }
      // Commit a staged Manual Power toggle LAST, so it wins over any mode write. (v0.21.85)
      if (type === "General device" && base in this.draft) {
        const raw = this.draft[base];
        this.hass?.callService("switch", raw === "on" ? "turn_on" : "turn_off",
          { entity_id: base });
        this.markOutPend(base, raw === "on");
        const dd = { ...this.draft }; delete dd[base]; this.draft = dd;
      }
      this.clearOutletCfgDraft(slot, n);
      const rest = { ...this._stDt }; delete rest[key]; this._stDt = rest;
    };
    const discard = () => {
      const rest = { ...this._stDt }; delete rest[key]; this._stDt = rest;
      this.clearOutletCfgDraft(slot, n);
      this.clearOutletDraft(slot, n);
      this.clearOutletNameDraft(slot, n);
      if (base in this.draft) {
        const dd = { ...this.draft }; delete dd[base]; this.draft = dd;
      }
    };
    return html`
      <div class="toggle-row" style="margin-top:4px">
        <span>Device Type</span>
        <select style="max-width:60%"
          @change=${(e: Event) => set({ type: (e.target as HTMLSelectElement).value })}>
          ${ST_DEVICE_TYPES.map((t) => html`
            <option value=${t.label} ?selected=${t.label === type}>${t.label}</option>`)}
        </select>
      </div>
      ${type === "Blower" ? html`
        <div class="toggle-row" style="margin-top:8px">
          <span>Mode</span>
          <select style="max-width:60%"
            @change=${(e: Event) => set({ blower: (e.target as HTMLSelectElement).value })}>
            ${Object.keys(ST_BLOWER_MODE).map((m) => html`
              <option value=${m} ?selected=${m === blower}>${m}</option>`)}
          </select>
        </div>` : nothing}
      ${type === "Light Env" ? html`
        <div class="toggle-row" style="margin-top:8px">
          <span>Follows</span>
          <select style="max-width:60%"
            @change=${(e: Event) => set({ light: (e.target as HTMLSelectElement).value })}>
            ${["Day", "Night"].map((m) => html`
              <option value=${m} ?selected=${m === light}>${m}</option>`)}
          </select>
        </div>
        <div class="set-note" style="margin-top:8px">
          Follows the environment day/night cycle (from Environment/Planting Plan):
          on during the selected phase, off in the other. The integration drives it.
        </div>` : nothing}
      ${type === "General device"
        ? this.stagedCtl(`switch.sf_${slot}_outlet_${n}`, "Power") : nothing}
      ${type === "Timer period" ? this.renderOutletSchedule(slot, n) : nothing}
      ${type === "Timer loop" ? this.renderOutletModeConfig(slot, n, "Cycle") : nothing}
      ${ST_APPLIANCE_NOTE.has(type) ? html`
        <div class="set-note" style="margin-top:8px">
          Runs from your Environment day/night targets (set on the Environment tab).
          There are no separate on/off thresholds here.
        </div>` : nothing}
      ${this.saveBar(dirty, apply, discard, "apply-bar")}`;
  }

  private renderOutletPop() {
    const key = this.outletOpen;
    if (!key) return nothing;
    // Split on the LAST underscore: the outlet number is always the trailing
    // segment, and the slot may itself contain an underscore for a second
    // same-type strip (e.g. "ac5_2" -> key "ac5_2_3" -> slot "ac5_2", n 3).
    const i = key.lastIndexOf("_");
    if (i < 0) return nothing;
    const slot = key.slice(0, i);
    const n = Number(key.slice(i + 1));
    if (!slot || !Number.isFinite(n)) return nothing;
    const modeId = `select.sf_${slot}_outlet_${n}_mode`;
    if (!this.get(modeId)) return nothing;
    const base = `switch.sf_${slot}_outlet_${n}`;
    const baseE = this.get(base);
    const prefix = `sf_${slot}_outlet_${n}_`;
    // Fully staged, like the device tiles: a staged Mode change drives the pop
    // body without writing to the device (so switching to a scheduled mode never
    // auto-turns the outlet on). The Time Slot schedule editor shows for the
    // staged mode from a local draft — the integration only creates a mode's
    // per-field config entities once the device is actually in that mode, so the
    // *extra* dropdowns (cycle timings, device dropdowns) fill in after Apply.
    const mode = this.draftVal(modeId) || this.get(modeId)?.state || "";
    const useTs = mode === "Time Slot";
    // Only the staged mode's config fields (that the device has actually created
    // yet). When the staged mode differs from the device's current mode, its
    // fields don't exist until Apply — the multi-slot Time Slot editor still
    // shows (local draft); other modes' dropdowns fill in after Apply.
    const allowed = new Set(
      (OUTLET_MODE_FIELDS[mode] || []).map((f) => `${prefix}${f}`));
    const extras = Object.keys(this.hass?.states ?? {})
      .filter((eid) => {
        const obj = eid.split(".")[1] ?? "";
        if (!allowed.has(obj)) return false;
        // The multi-slot editor replaces the single-slot ts_* controls.
        if (useTs && (obj === `${prefix}ts_type` || obj === `${prefix}ts_start`
            || obj === `${prefix}ts_stop`)) return false;
        return true;
      })
      .sort();
    // A mode picked but not yet on the device: its config entities don't exist,
    // so show local config controls and commit the mode + config atomically via
    // sf.set_outlet_config (instead of a bare mode write that lands with defaults).
    const deviceMode = this.get(modeId)?.state || "";
    const stagedNewMode = mode !== deviceMode && mode !== "Manual" && !useTs
      && (OUTLET_MODE_FIELDS[mode] || []).length > 0 && extras.length === 0;
    const cfgKey = this.outletKey(slot, n);
    // Scalar ids the Apply bar commits. When configuring a fresh mode the mode is
    // sent via the service, so leave modeId out to avoid a duplicate mode write.
    const ids = [
      ...(stagedNewMode ? [] : [modeId]),
      ...(baseE ? [base] : []),
      ...extras.filter((eid) => /^(switch|number|select|text)\./.test(eid)),
    ];
    const tsDirty = !!this.outletDraft[this.outletKey(slot, n)];
    const nameDirty = this.outletNameDirty(slot, n);
    const lightDirty = mode === "Light Env"
      && "light_device" in (this.outletCfgDraft[cfgKey] ?? {})
      && this.outletCfgDraft[cfgKey].light_device !== (this.outletLightDir[cfgKey] ?? "Day");
    const cfgDirty = stagedNewMode || lightDirty;   // new mode / Day-Night change arms Apply
    return html`
      <div class="soil-pop" style="--sf-accent:${this.accent()}">
        <div class="soil-pop-head">
          <span>${this.outletName(slot, n)}</span>
          <span style="display:inline-flex;align-items:center;gap:8px">
            <button class="oc-copybtn" title="Copy this outlet's settings to others"
              @click=${() => { this.outletCopyOpen = !this.outletCopyOpen; this.outletCopyFromOpen = false; this.outletCopySel = {}; }}>
              <ha-icon icon="mdi:content-copy"></ha-icon>Copy to…
            </button>
            <button class="oc-copybtn" title="Copy another outlet's settings into this one"
              @click=${() => { this.outletCopyFromOpen = !this.outletCopyFromOpen; this.outletCopyOpen = false; }}>
              <ha-icon icon="mdi:content-duplicate"></ha-icon>Copy from…
            </button>
            <ha-icon icon="mdi:close" role="button" aria-label="Close"
              @click=${() => this.toggleOutlet(null)}></ha-icon>
          </span>
        </div>
        ${this.outletCopyOpen ? this.renderOutletCopyPanel(slot, n) : nothing}
        ${this.outletCopyFromOpen ? this.renderOutletCopyFromPanel(slot, n) : nothing}
        ${this.customOutletNames ? html`
          <div class="toggle-row ${this.outletNameDirty(slot, n) ? "staged" : ""}">
            <span>Name</span>
            <span class="num-box">
              <input type="text" style="width:140px;text-align:left"
                .value=${this.outletKey(slot, n) in this.outletNameDraft
                  ? this.outletNameDraft[this.outletKey(slot, n)]
                  : (this.outletNames[`${slot}_${n}`] ?? "")}
                placeholder=${`Outlet ${n}`}
                @input=${(e: Event) =>
                  this.stageOutletName(slot, n, (e.target as HTMLInputElement).value)} />
            </span>
          </div>` : nothing}
        ${slot.startsWith("st") ? this.renderStationDeviceType(slot, n) : html`
        ${this.stagedCtl(modeId, "Mode")}
        ${baseE && !stagedNewMode && mode !== "Light Env" ? this.stagedCtl(base, "Power") : nothing}
        ${stagedNewMode ? this.renderOutletModeConfig(slot, n, mode) : nothing}
        ${mode === "Light Env" ? this.renderLightEnvConfig(slot, n) : nothing}
        ${mode === "Light Env" ? nothing : extras.map((eid) => this.stagedCtl(eid))}
        ${useTs ? this.renderOutletSchedule(slot, n) : nothing}
        ${this.applyBar(ids, {
          extraDirty: tsDirty || nameDirty || cfgDirty,
          onApply: () => {
            // On an external (sensorless) strip an Environment outlet can't run on
            // the device — the integration drives it. We still WRITE the mode +
            // direction to the device (so the device config is the source of truth
            // the integration auto-adopts and keeps in sync — Cooling/Heating,
            // Humidify/Dehumidify all track live). Only when switching to a NON-env
            // mode do we tell the integration to hand control back.
            const ext = this.stripIsExternal(slot);
            const wasLight = deviceMode === "Light Env";
            const isLight = mode === "Light Env";
            const dir = isLight
              ? (this.outletCfgDraft[cfgKey]?.light_device
                 || this.outletLightDir[cfgKey] || "Day")
              : mode === "Humidity"
              ? (this.outletCfgDraft[cfgKey]?.humidity_device
                 || this.draftVal(`select.sf_${slot}_outlet_${n}_humidity_device`)
                 || "Humidifying")
              : (this.outletCfgDraft[cfgKey]?.temp_device
                 || this.draftVal(`select.sf_${slot}_outlet_${n}_temp_device`)
                 || "Cooling");
            if (isLight) {
              // The staged Mode select writes Manual to the device (Light Env ->
              // modeType 0). Enable the integration's day/night driver + remember
              // the Day/Night choice (server-side, and instantly on the tile).
              this.applyOutletEnv(slot, n, "Light Env", dir);
              this.outletLightDir = { ...this.outletLightDir, [cfgKey]: dir };
              this.dirPick = { ...this.dirPick, [cfgKey]: dir };
              this.persistColorOption(`oletdir_${cfgKey}`, dir);
              this.clearOutletCfgDraft(slot, n);
              this.modePick = { ...this.modePick, [modeId]: "Light Env" };
            } else {
              if (wasLight) {
                // Leaving Light Env: hand the socket back to the device.
                this.hass?.callService("sf", "set_outlet_env", {
                  entity_id: modeId, enabled: false });
                this.persistColorOption(`oletdir_${cfgKey}`, "");
                const dd = { ...this.outletLightDir }; delete dd[cfgKey];
                this.outletLightDir = dd;
              } else if (ext && !this.isEnvOutletMode(mode)) {
                this.applyOutletEnv(slot, n, mode, dir);   // release integration control
              }
              // Show the chosen direction on the tile immediately (env modes),
              // before the integration's config confirm-poll echoes the select.
              if (this.isEnvOutletMode(mode)) {
                this.dirPick = { ...this.dirPick, [cfgKey]: dir };
              }
              if (stagedNewMode) {
                this.hass?.callService("sf", "set_outlet_config", {
                  entity_id: modeId, mode,
                  config: this.outletCfgDraft[cfgKey] ?? {},
                });
                this.clearOutletCfgDraft(slot, n);
                if (modeId in this.draft) {
                  const dd = { ...this.draft }; delete dd[modeId]; this.draft = dd;
                }
                // Keep the pop showing the new mode until the device confirms.
                this.modePick = { ...this.modePick, [modeId]: mode };
              }
            }
            this.saveOutlet(slot, n);
            this.commitOutletName(slot, n);
            // A manual change supersedes any remembered quick-toggle profile.
            this.olqClear(slot, n);
          },
          onDiscard: () => {
            this.clearOutletDraft(slot, n);
            this.clearOutletNameDraft(slot, n);
            this.clearOutletCfgDraft(slot, n);
            if (modeId in this.draft) {
              const dd = { ...this.draft }; delete dd[modeId]; this.draft = dd;
            }
          },
        })}`}
      </div>`;
  }

  // ── Outlet Time Slot editor (multi-slot, weekday-aware) ──────────────────
  private outletKey(slot: string, n: number): string {
    return `${slot}_${n}`;
  }
  // A strip on an external temperature source (no SF air sensor) can't run its
  // own Temperature-mode outlets on the device — the integration drives them.
  // The picker is per-card, so this holds for the card's own panel strip.
  private stripIsExternal(slot: string): boolean {
    return slot === this.config.panel && this.tempSource === "external";
  }
  // Route an outlet's Environment mode (Temperature/Humidity) to the integration
  // engine (sf.set_outlet_env) on a sensorless strip, or hand control back
  // (enabled:false) for a non-env mode.
  private isEnvOutletMode(mode: string): boolean {
    return mode === "Temperature" || mode === "Humidity" || mode === "Light Env";
  }
  private applyOutletEnv(slot: string, n: number, mode: string, dir: string): void {
    const env = this.isEnvOutletMode(mode);
    this.hass?.callService("sf", "set_outlet_env", {
      entity_id: `select.sf_${slot}_outlet_${n}_mode`,
      enabled: env,
      mode: env ? mode : "Temperature",
      direction: dir,
    });
  }
  private outletPeriods(slot: string, n: number): OutletSlot[] {
    const d = this.outletDraft[this.outletKey(slot, n)];
    if (d) return d;
    const a = this.get(`sensor.sf_${slot}_outlet_${n}_ts_schedule`)?.attributes.periods;
    return Array.isArray(a) ? (a as OutletSlot[]) : [];
  }
  private editOutlet(slot: string, n: number, fn: (arr: OutletSlot[]) => void) {
    const k = this.outletKey(slot, n);
    const base = this.outletDraft[k] ?? this.outletPeriods(slot, n);
    const copy: OutletSlot[] = JSON.parse(JSON.stringify(base));
    fn(copy);
    this.outletDraft = { ...this.outletDraft, [k]: copy };
  }
  private clearOutletDraft(slot: string, n: number) {
    const k = this.outletKey(slot, n);
    const rest = { ...this.outletDraft };
    delete rest[k];
    this.outletDraft = rest;
  }
  private saveOutlet(slot: string, n: number) {
    const periods = this.outletDraft[this.outletKey(slot, n)];
    if (!periods) return;
    this.hass?.callService("sf", "set_outlet_schedule", {
      entity_id: `select.sf_${slot}_outlet_${n}_mode`,
      periods,
    });
    this.clearOutletDraft(slot, n);
  }

  private renderOutletSchedule(slot: string, n: number) {
    const periods = this.outletPeriods(slot, n);
    const accent = this.accent();
    return html`
      <div class="ts-editor">
        ${periods.map((p, i) => html`
          <div class="period">
            <div class="period-head">
              <span class="period-name">Slot ${i + 1}</span>
              <button class="del" aria-label="Delete slot"
                @click=${() => this.editOutlet(slot, n, (a) => a.splice(i, 1))}>✕</button>
            </div>
            <div class="days">
              ${DAY_LETTERS.map(
                (d, di) => html`<button
                  class="day ${p.days.includes(di) ? "on" : ""}"
                  style=${p.days.includes(di) ? `background:${accent};border-color:${accent}` : ""}
                  @click=${() =>
                    this.editOutlet(slot, n, (a) => {
                      const arr = a[i].days;
                      const k = arr.indexOf(di);
                      if (k >= 0) arr.splice(k, 1);
                      else arr.push(di);
                      arr.sort((x, y) => x - y);
                    })}>${d}</button>`
              )}
            </div>
            <div class="sched-times">
              <div class="tf">
                <span class="tf-lbl">Start</span>
                <input type="time" .value=${p.start}
                  @change=${(e: Event) =>
                    this.editOutlet(slot, n, (a) => { a[i].start = (e.target as HTMLInputElement).value; })} />
              </div>
              <span class="dash">—</span>
              <div class="tf">
                <span class="tf-lbl">Stop</span>
                <input type="time" .value=${p.end}
                  @change=${(e: Event) =>
                    this.editOutlet(slot, n, (a) => { a[i].end = (e.target as HTMLInputElement).value; })} />
              </div>
            </div>
          </div>`)}
        <div class="sched-actions">
          <button class="add"
            @click=${() =>
              this.editOutlet(slot, n, (a) =>
                a.push({ days: [0, 1, 2, 3, 4, 5, 6], start: "08:00", end: "20:00" }))}>
            + Add slot
          </button>
        </div>
      </div>`;
  }

  // ── Calibration tab ────────────────────────────────────────────────────
  private caliSoilSlots(): string[] {
    const re = new RegExp(`^sf_${this.config.panel}_(soil\\d+)_cal_temp$`);
    const slots = new Set<string>();
    for (const eid of Object.keys(this.hass?.states ?? {})) {
      const m = objectId(eid).match(re);
      if (m) slots.add(m[1]);
    }
    return [...slots].sort(
      (a, b) => Number(a.replace(/\D/g, "")) - Number(b.replace(/\D/g, ""))
    );
  }


  // Probe display name from the offset entity. has_entity_name prefixes the
  // device name (e.g. "SF Display Panel 4E01 Front Left Temp Calibration");
  // strip the device prefix and the " Temp Calibration" suffix -> "Front
  // Left", falling back to "Soil N".
  private probeName(slot: string): string {
    const e = this.get(`number.sf_${this.config.panel}_${slot}_cal_temp`);
    let fn = (e?.attributes.friendly_name as string | undefined) ?? "";
    const dev = slotDeviceName(this.hass, this.config.panel);
    if (dev && fn.startsWith(dev)) fn = fn.slice(dev.length).trim();
    fn = fn.replace(/\s*Temp Calibration\s*$/i, "").trim();
    return fn || slot.replace(/^soil(\d+)$/, "Soil $1");
  }

  private renderCali() {
    const p = this.config.panel;
    const air: [string, string][] = [
      [`number.sf_${p}_cal_air_temp`, "Air Temp"],
      [`number.sf_${p}_cal_air_humidity`, "Air Humidity"],
      [`number.sf_${p}_cal_ppfd`, "PPFD"],
      [`number.sf_${p}_cal_co2`, "CO2"],
    ];
    const airRows = air
      .map(([id, l]) => this.envControl(id, l))
      .filter((x) => x !== nothing);

    const soilBlocks = this.caliSoilSlots().map((slot) => {
      const rows = [
        this.envControl(`number.sf_${p}_${slot}_cal_temp`, "Temp"),
        this.envControl(`number.sf_${p}_${slot}_cal_moisture`, "Moisture"),
        this.envControl(`number.sf_${p}_${slot}_cal_ec`, "EC"),
      ].filter((x) => x !== nothing);
      const sub = this.stagedCtl(`select.sf_${p}_${slot}_substrate`, "Substrate");
      return html`
        <div class="env-row">
          <div class="env-row-head">
            <ha-icon icon="mdi:sprout" style="color:${this.accent()}"></ha-icon>
            <span>${this.probeName(slot)}</span>
          </div>
          <div class="cali-soil-grid">${rows}${sub !== nothing ? sub : nothing}</div>
        </div>`;
    });

    const leafCal = this.renderLeafVpdCalibration();

    if (!airRows.length && !soilBlocks.length && leafCal === nothing) {
      return html`<div class="cali-empty">
        No calibration entities yet — they appear once the controller has
        reported its configuration.
      </div>`;
    }
    return html`
      ${airRows.length
        ? html`<div class="section-label">Air Calibration</div>
            <div class="cali-air">${airRows}</div>`
        : nothing}
      ${soilBlocks.length
        ? html`<div class="section-label">Soil Calibration</div>${soilBlocks}`
        : nothing}
      ${leafCal}
      ${this.renderSensorCleaning()}
      ${this.applyBar(this.caliIds())}`;
  }

  // ── Alerts tab (alarm thresholds) ────────────────────────────────────────
  private alertsSettings(): any {
    if (this.alertsDraft) return this.alertsDraft;
    const s = this.get(`sensor.sf_${this.config.panel}_alarm_settings`)
      ?.attributes.settings;
    return s && typeof s === "object" ? s : null;
  }
  private editAlert(fn: (s: any) => void) {
    const base = this.alertsDraft ?? this.alertsSettings() ?? {};
    const copy = JSON.parse(JSON.stringify(base));
    fn(copy);
    this.alertsDraft = copy;
  }
  private saveAlerts() {
    if (!this.alertsDraft) return;
    this.hass?.callService("sf", "set_alarm_settings", {
      entity_id: `sensor.sf_${this.config.panel}_alarm_settings`,
      settings: this.alertsDraft,
    });
    this.alertsDraft = null;
  }

  private renderAlerts() {
    const s = this.alertsSettings();
    if (!s)
      return html`<div class="cali-empty">No alerts reported for this device yet. Turn on alerts for it in the Spider Farmer app, and they'll appear here.</div>`;
    const dirty = this.alertsDraft !== null;
    return html`
      <div class="alert-note">Alarm when the reading leaves the set range.</div>
      ${this.renderAlertGroup(s, "climate", "Climate")}
      ${this.renderAlertGroup(s, "substrate", "Substrate")}
      ${this.renderAlertOther(s)}
      ${this.saveBar(dirty,
        () => this.saveAlerts(), () => (this.alertsDraft = null), "apply-bar")}`;
  }

  private renderAlertGroup(s: any, grp: string, title: string) {
    const metrics = (s[grp] as any[]) || [];
    if (!metrics.length) return nothing;
    return html`
      <div class="section-label">${title}</div>
      ${metrics.map((m, i) => this.renderAlertMetric(grp, i, m))}`;
  }

  // Sensible dropdown bounds per alarm metric (the wire block carries the
  // current thresholds but not their valid range).
  // The HA instance's temperature unit ("°C" / "°F"); the backend decodes temps
  // to this unit, so the card's temperature ranges/labels must follow it.
  private tempUnit(): string {
    return (this.hass as any)?.config?.unit_system?.temperature || "°F";
  }
  private isCelsius(): boolean {
    return this.tempUnit().includes("C");
  }
  // Off + the valid go-dark / turn-off temperature range in the user's unit.
  private tempThresholdOpts() {
    const c = this.isCelsius();
    return this.offOpts(c ? 15 : 59, c ? 50 : 122, 1, (n) => `${n}${this.tempUnit()}`);
  }

  private alertBounds(key: string): [number, number] {
    switch (key) {
      case "temp": case "tempSoil": return this.isCelsius() ? [0, 50] : [32, 122];
      case "humi": case "humiSoil": return [0, 100];
      case "vpd": return [0, 6];
      case "co2": return [0, 5000];
      case "ppfd": return [0, 4000];   // app PPFD alarm max tops out at 4000
      case "ECSoil": return [0, 10];
      default: return [0, 100];
    }
  }

  private renderAlertMetric(grp: string, i: number, m: any) {
    const accent = this.accent();
    const [lo, hi] = this.alertBounds(m.key);
    const step = Number(m.step ?? 1) || 1;
    // The app's Min picker tops out 100 µmol/m²/s below the Max ceiling for
    // PPFD (so Min reaches 3900 while Max reaches 4000); the two pickers are
    // otherwise independent. Other metrics use the same [lo, hi] for both.
    const minHi = m.key === "ppfd" ? Math.max(lo, hi - 100) : hi;
    const numField = (label: string, key: "max" | "min") => {
      const opts = this.numOpts(lo, key === "min" ? minHi : hi, step);
      return html`
      <label class="av">
        <span class="av-lbl">${label}</span>
        <span class="num-box">
          <select @change=${(e: Event) =>
              this.editAlert((x) => { x[grp][i][key] = Number((e.target as HTMLSelectElement).value); })}>
            ${opts.map((o) => html`
              <option value=${o.value} .selected=${String(o.value) === String(m[key] ?? "")}>${o.label}</option>`)}
          </select>
          <span class="unit">${m.unit ?? ""}</span>
        </span>
      </label>`;
    };
    return html`
      <div class="alert-row ${m.enabled ? "" : "off"}">
        <div class="alert-head">
          <span class="alert-name">${m.label} <span class="unit">${m.unit ?? ""}</span></span>
          <button class="toggle ${m.enabled ? "on" : ""}"
            style=${m.enabled ? `background:${accent}` : ""}
            @click=${() => this.editAlert((x) => { const mm = x[grp][i]; mm.enabled = mm.enabled ? 0 : 1; })}
            aria-label="Toggle ${m.label} alarm"></button>
        </div>
        <div class="alert-vals">
          ${m.kind === "range" ? numField("Min", "min") : nothing}
          ${numField("Max", "max")}
        </div>
      </div>`;
  }

  private renderAlertOther(s: any) {
    const metrics = (s.other as any[]) || [];
    if (!metrics.length) return nothing;
    const accent = this.accent();
    return html`
      <div class="section-label">Other Device</div>
      ${metrics.map(
        (m, i) => html`<div class="alert-bool">
          <span class="alert-name">${m.label}</span>
          <button class="toggle ${m.enabled ? "on" : ""}"
            style=${m.enabled ? `background:${accent}` : ""}
            @click=${() => this.editAlert((x) => { const mm = x.other[i]; mm.enabled = mm.enabled ? 0 : 1; })}
            aria-label="Toggle ${m.label} alarm"></button>
        </div>`
      )}`;
  }

  // ── Log tab (alarm / notification history) ──────────────────────────────
  /** Devices on this card that have an Alarms sensor: the panel, then any
   *  strips nested under it. */
  private alarmSources(): { slot: string; ent: HassEntity; name: string }[] {
    const out: { slot: string; ent: HassEntity; name: string }[] = [];
    const add = (slot: string) => {
      const ent = this.get(`sensor.sf_${slot}_alarms`);
      if (ent) out.push({ slot, ent, name: slotDeviceName(this.hass!, slot) || slot });
    };
    if (this.config.panel) add(this.config.panel);
    for (const slot of this.outletSlots()) if (slot !== this.config.panel) add(slot);
    return out;
  }
  /** Local calendar date as YYYY-MM-DD, recomputed per render so a card left
   *  open overnight rolls over to the new day by itself. */
  private logToday(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${
      String(d.getDate()).padStart(2, "0")}`;
  }
  private renderLog() {
    const sources = this.alarmSources();
    const date = this.logDate || this.logToday();
    const dev = this.logDev || "all";
    const type = this.logType || "all";

    let events: any[] = [];
    for (const src of sources) {
      if (dev !== "all" && dev !== src.slot) continue;
      const list = src.ent.attributes.events;
      if (Array.isArray(list)) {
        list.forEach((e: any) => events.push({ ...e, _src: src.name }));
      }
    }
    const types = [...new Set(events.map((e) => e.device).filter(Boolean))].sort();
    // v0.17.2: the selected day only — this previously matched that day and
    // everything earlier, so months-old entries showed under today's date.
    const dayStart = new Date(`${date}T00:00:00`).getTime() / 1000;
    const dayEnd = new Date(`${date}T23:59:59.999`).getTime() / 1000;
    const fmt = (epoch: number) => {
      try {
        return new Date(epoch * 1000).toLocaleString(undefined, {
          year: "numeric", month: "2-digit", day: "2-digit",
          hour: "2-digit", minute: "2-digit", second: "2-digit",
        });
      } catch {
        return "";
      }
    };
    // De-duplicate rows that read identically at the same second: a single
    // physical device (e.g. the 4-in-1 Sensor) can report as two alarm modules
    // (devType 17 + 18) for one event, which the SF app shows as one line.
    const seenRows = new Set<string>();
    events = events
      .filter((e) => (e.epoch || 0) >= dayStart && (e.epoch || 0) <= dayEnd
        && (type === "all" || e.device === type))
      .sort((a, b) => (b.epoch || 0) - (a.epoch || 0))
      .filter((e) => {
        const key = `${e.epoch}|${e._src}|${e.device || `Device ${e.devType}`}`
          + `|${e.alarm || ""}|${e.alarmType || 0}`;
        if (seenRows.has(key)) return false;
        seenRows.add(key);
        return true;
      })
      .slice(0, 50);

    return html`
      <div class="log-filters">
        ${sources.length > 1
          ? html`<div class="ctl">
              <div class="ctl-label">Device</div>
              <div class="ctl-input">
                <select @change=${(e: Event) => {
                  this.logDev = (e.target as HTMLSelectElement).value;
                }}>
                  <option value="all" ?selected=${dev === "all"}>All</option>
                  ${sources.map((src) => html`
                    <option value=${src.slot} ?selected=${dev === src.slot}>${src.name}</option>`)}
                </select>
              </div>
            </div>`
          : nothing}
        <div class="ctl">
          <div class="ctl-label">Type</div>
          <div class="ctl-input">
            <select @change=${(e: Event) => {
              this.logType = (e.target as HTMLSelectElement).value;
            }}>
              <option value="all" ?selected=${type === "all"}>All</option>
              ${types.map((t) => html`
                <option value=${t} ?selected=${type === t}>${t}</option>`)}
            </select>
          </div>
        </div>
        <div class="ctl">
          <div class="ctl-label">Date</div>
          <div class="ctl-input">
            <input type="date" .value=${date} @change=${(e: Event) => {
              this.logDate = (e.target as HTMLInputElement).value || null;
            }} />
          </div>
        </div>
      </div>
      ${events.length
        ? html`
            <div class="log-count">${events.length} ${
              events.length === 1 ? "entry" : "entries"}${
              events.length > 10 ? " — scroll for more" : ""}</div>
            <div class="log-list">
              ${events.map((e) => html`
                <div class="log-row ${e.alarmType ? "raise" : "restore"}">
                  <div class="log-title">${
                    sources.length > 1 && dev === "all" ? `${e._src} ` : ""
                  }${e.device || `Device ${e.devType}`} ${e.alarm || ""}</div>
                  <div class="log-time">${e.epoch ? fmt(e.epoch) : e.time || ""}</div>
                </div>`)}
            </div>`
        : html`<div class="cali-empty">No log entries on this date.</div>`}`;
  }
  protected render() {
    if (!this.hass || !this.config) return nothing;
    // Rebuild the read-dependency set for this render (see shouldUpdate/_used).
    this._used = new Set();
    // All tabs show by default; only Outlets is gated on outlets being
    // present. Each renderer shows a friendly empty state when its device
    // hasn't reported that data yet.
    const showOutlets = this.hasOutlets();
    // Outlet-only strips hide the sensor/climate tabs and even Overview — the
    // card is pure outlet control.
    const outletOnly = this.outletOnly();
    // Environment / Calibration follow actual entity presence (not just
    // outlet-only): a strip that borrows a 3rd-party sensor (external mode) has
    // temp/humidity/VPD but no Environment targets or air calibration to drive,
    // so those tabs stay hidden while Overview/VPD appear. (v0.21.25)
    const hasEnvEntity = !!this.get(this.eid("number", "env_temp_day"));
    const panelPref = `sf_${this.config.panel}_`;
    const hasCaliEntity = !!this.get(this.eid("number", "cal_air_temp"))
      || Object.keys(this.hass.states).some(
        (k) => k.includes(panelPref) && /_cal_(temp|moisture|ec)$/.test(k));
    const showEnv = hasEnvEntity;
    const showCali = hasCaliEntity;
    const showAlerts = !outletOnly;
    const showVpdTab = this.showVpd && !outletOnly;
    const showOverview = !outletOnly;
    const fallback = outletOnly ? "outlets" : "overview";
    let tab = this.tab;
    // An outlet-only card lands on Outlets and never shows the hidden tabs.
    if (outletOnly && (tab === "overview" || tab === "alerts" || tab === "vpd"))
      tab = "outlets";
    if (tab === "env" && !showEnv) tab = fallback;
    if (tab === "cali" && !showCali) tab = fallback;
    if (tab === "outlets" && !showOutlets) tab = "overview";
    if (tab === "olog" && !(showOutlets && this.showOutletsLog)) tab = "overview";
    if (tab === "vpd" && !showVpdTab) tab = fallback;
    if (tab === "dlog" && !(this.showDeviceLog && this.overviewDevices().length > 0)) tab = fallback;
    const hasTabs = true;
    const accent = this.accent();
    const tabBtn = (
      id: "overview" | "env" | "outlets" | "olog" | "dlog" | "vpd" | "cali" | "alerts" | "log" | "settings",
      label: string
    ) => html`<button class="tab ${tab === id ? "active" : ""}"
        style=${tab === id ? `color:${accent};border-color:${accent}` : ""}
        @click=${() => (this.tab = id)}>${label}</button>`;
    const devName = slotDeviceName(this.hass, this.config.panel);
    // Tile-appearance scope: exclude classes gate which tile categories pick up
    // the custom appearance vars (see .ta-x-* CSS). Absent classes = apply to all.
    const taScope = [
      this.taTiles ? "" : "ta-x-t",
      this.taDevices ? "" : "ta-x-d",
      this.taOutlets ? "" : "ta-x-o",
    ].filter(Boolean).join(" ");
    return html`
      <ha-card class=${taScope || nothing} style=${this.layoutStyle() || nothing}>
        <div class="header">
          <span class="title">${this.config.title || "Spider Farmer"}</span>
          ${devName ? html`<span class="device">${devName}</span>` : nothing}
          ${this.renderConn()}
        </div>
        ${hasTabs
          ? html`<div class="tabs">
              ${showOverview ? tabBtn("overview", "Overview") : nothing}
              ${showEnv ? tabBtn("env", "Environment") : nothing}
              ${showOutlets ? tabBtn("outlets", "Outlets") : nothing}
              ${showOutlets && this.showOutletsLog ? tabBtn("olog", "Outlets Log") : nothing}
              ${this.showDeviceLog && this.overviewDevices().length > 0 ? tabBtn("dlog", "Device Log") : nothing}
              ${showVpdTab ? tabBtn("vpd", "VPD") : nothing}
              ${showCali ? tabBtn("cali", "Calibration") : nothing}
              ${showAlerts ? tabBtn("alerts", "Alerts") : nothing}
              ${tabBtn("log", "Log")}
              ${tabBtn("settings", "Settings")}
            </div>`
          : nothing}
        ${tab === "env"
          ? this.renderEnv()
          : tab === "outlets"
          ? this.renderOutlets()
          : tab === "olog"
          ? this.renderOutletsLog()
          : tab === "dlog"
          ? this.renderDeviceLog()
          : tab === "vpd"
          ? this.renderVpdTab()
          : tab === "cali"
          ? this.renderCali()
          : tab === "alerts"
          ? this.renderAlerts()
          : tab === "log"
          ? this.renderLog()
          : tab === "settings"
          ? this.renderSettings()
          : this.renderOverview()}
      </ha-card>`;
  }

  private setLeafSpot(i: number, raw: string) {
    const next = [...this.leafSpots];
    next[i] = parseFloat(raw);
    this.leafSpots = next;
  }
  // Leaf-VPD calibration (Calibration tab). The offset is a real integration
  // number entity, written live. The calibrator averages 5 measured leaf temps
  // and sets the offset to (avg leaf − live air).
  private renderLeafVpdCalibration() {
    if (!this.showLeafVpd) return nothing;    // Leaf VPD hidden in Settings
    const offId = this.eid("number", "leaf_offset");
    const off = this.get(offId);
    if (!off) return nothing;                 // panel has no air temp/humidity
    const unit = off.attributes.unit_of_measurement || "°";
    const temp = this.get(this.eid("sensor", "temperature"));
    const air = temp && Number.isFinite(+temp.state) ? +temp.state : null;
    if (this.leafSpots.length !== 5) {
      const seed = air ?? 0;
      this.leafSpots = Array(5).fill(Math.round(seed * 10) / 10);
    }
    const spots = this.leafSpots;
    const valid = spots.filter((v) => Number.isFinite(v));
    const avg = valid.length ? valid.reduce((a, b) => a + b, 0) / valid.length : null;
    const derived = avg != null && air != null ? avg - air : null;
    // Stage into the draft (not a live write) so the Calibration tab's
    // Apply/Discard bar gates it, like every other calibration control. The
    // calibrator's button stages the derived offset into the same field.
    const staged = offId in this.draft;
    const stageOff = (v: number) =>
      this.stage(offId, String(Math.round(v * 10) / 10));
    const offNightId = this.eid("number", "leaf_offset_night");
    const hasNight = !!this.get(offNightId);
    const stagedNight = offNightId in this.draft;
    const stageNight = (v: number) =>
      this.stage(offNightId, String(Math.round(v * 10) / 10));
    const sign = (v: number) => (v >= 0 ? "+" : "") + v.toFixed(1);
    const accent = this.accent();
    // Which offset the 5-reading calibrator fills (Day unless Night is present
    // and selected). One reading box serves both.
    const calTarget = hasNight ? this.leafCalTarget : "day";
    const stageCal = (v: number) =>
      calTarget === "night" ? stageNight(v) : stageOff(v);
    return html`
      <div class="section-label" style="margin-top:16px">Leaf VPD</div>
      <div class="set-note">
        VPD referenced to the leaf surface, which runs cooler than the air. Under
        the light leaves transpire and sit well below air; lights-off they settle
        near air temp — so set a Day and Night offset. Calibrate the day value
        from measurements if you like, then Apply.
      </div>
      <div class="toggle-row ${staged ? "staged" : ""}">
        <span>Leaf offset (day)</span>
        <span class="num-box">
          <input type="number" step="0.1" .value=${this.draftVal(offId)}
            @change=${(e: Event) => {
              const n = parseFloat((e.target as HTMLInputElement).value);
              if (Number.isFinite(n)) stageOff(n);
            }} />
          <span class="unit">${unit}</span>
        </span>
      </div>
      ${hasNight ? html`
      <div class="toggle-row ${stagedNight ? "staged" : ""}">
        <span>Leaf offset (night)</span>
        <span class="num-box">
          <input type="number" step="0.1" .value=${this.draftVal(offNightId)}
            @change=${(e: Event) => {
              const n = parseFloat((e.target as HTMLInputElement).value);
              if (Number.isFinite(n)) stageNight(n);
            }} />
          <span class="unit">${unit}</span>
        </span>
      </div>` : nothing}
      <details class="leaf-cal">
        <summary>Calibrate from 5 readings</summary>
        <div class="set-note">
          Point an IR thermometer at 5 leaf spots and enter each. The average
          becomes leaf temp; the implied offset (leaf − air) fills the offset you
          pick below — Apply to save it. Measure under the light for Day, lights-off
          for Night.
        </div>
        ${hasNight ? html`
        <div class="seg-row" style="grid-template-columns:repeat(2,1fr);margin-bottom:8px">
          <button class="seg ${calTarget === "day" ? "on" : ""}"
            style=${calTarget === "day" ? `border-color:${accent};color:${accent}` : nothing}
            @click=${() => { this.leafCalTarget = "day"; }}>
            <ha-icon icon="mdi:white-balance-sunny"></ha-icon><span>Day</span>
          </button>
          <button class="seg ${calTarget === "night" ? "on" : ""}"
            style=${calTarget === "night" ? `border-color:${accent};color:${accent}` : nothing}
            @click=${() => { this.leafCalTarget = "night"; }}>
            <ha-icon icon="mdi:weather-night"></ha-icon><span>Night</span>
          </button>
        </div>` : nothing}
        <div class="leaf-spots">
          ${spots.map((v, i) => html`<input type="number" step="0.1"
            .value=${Number.isFinite(v) ? String(v) : ""}
            @input=${(e: Event) =>
              this.setLeafSpot(i, (e.target as HTMLInputElement).value)} />`)}
        </div>
        <div class="leaf-cal-foot">
          <span>
            Avg ${avg != null ? avg.toFixed(1) + unit : "—"}
            · offset ${derived != null ? sign(derived) + unit : "—"}
          </span>
          <button class="leaf-apply" ?disabled=${derived == null}
            @click=${() => derived != null && stageCal(derived)}>
            Use for ${calTarget === "night" ? "night" : "day"}</button>
        </div>
      </details>`;
  }
  // Entities of a given device_class for the external-sensor pickers, excluding
  // this integration's own sf_* entities (no self-reference).
  private _sensorOptions(deviceClass: string): { id: string; name: string }[] {
    if (!this.hass) return [];
    return Object.keys(this.hass.states)
      .filter((id) => id.startsWith("sensor.")
        && !id.includes("sf_")
        && (this.hass!.states[id].attributes as any)?.device_class === deviceClass)
      .map((id) => ({
        id,
        name: (this.hass!.states[id].attributes as any)?.friendly_name || id,
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  // Commit a staged Temperature-source change (called from the Settings tab's
  // single Apply bar, alongside every other setting). Writes via the
  // sf.set_strip_sensor service; the server republishes card_options.
  private _commitTempSource(dr: NonNullable<SpiderFarmerCard["colorDraft"]>): void {
    const source = dr.tsSource ?? this.tempSource;
    const temp = dr.tsTemp ?? this.extTemp;
    const humi = dr.tsHumi ?? this.extHumi;
    if (source === this.tempSource && temp === this.extTemp && humi === this.extHumi) return;
    const anchor = this.get(`switch.sf_${this.config.panel}_indicator_light`)
      ? `switch.sf_${this.config.panel}_indicator_light`
      : `switch.sf_${this.config.panel}_outlet_1`;
    this.tempSource = source; this.extTemp = temp; this.extHumi = humi;  // optimistic
    this.hass?.callService("sf", "set_strip_sensor", {
      entity_id: anchor,
      source,
      temp_entity: source === "external" ? temp : "",
      humi_entity: source === "external" ? humi : "",
    });
  }

  // Temperature source picker for an outlet-only strip: use the strip's own SF
  // sensor, or borrow a 3rd-party HA temp/humidity entity (mirrored by the
  // integration). Staged into the shared Settings draft so it commits on the
  // tab's one Apply/Discard bar. Only shown for AC/S-Station strips. (v0.21.26)
  private renderTempSource(
    d: NonNullable<SpiderFarmerCard["colorDraft"]> | null,
    stage: (patch: Partial<NonNullable<SpiderFarmerCard["colorDraft"]>>) => void,
  ) {
    const isStrip = /^(ac|st)\d/.test(this.config.panel || "");
    if (!isStrip) return nothing;
    const accent = this.accent();
    const source = d?.tsSource ?? this.tempSource;
    const temp = d?.tsTemp ?? this.extTemp;
    const humi = d?.tsHumi ?? this.extHumi;
    // Card's standard segmented button (.seg), in a compact flex row — NOT the
    // 3-column .seg-row grid, which stretched two buttons full-width.
    const seg = (val: string, label: string) => html`
      <button class="seg ${source === val ? "on" : ""}"
        style=${source === val ? `border-color:${accent};color:${accent}` : nothing}
        @click=${() => stage({ tsSource: val })}>${label}</button>`;
    // Same block as the Settings "Signal entity" select: a toggle-row with the
    // label on the left and a <select> capped at 60% on the right.
    const picker = (val: string, dc: string, key: "tsTemp" | "tsHumi", label: string) => html`
      <div class="toggle-row" style="margin-top:8px">
        <span>${label}</span>
        <select style="max-width:60%"
          @change=${(e: Event) => stage({ [key]: (e.target as HTMLSelectElement).value })}>
          <option value="" ?selected=${!val}>— choose —</option>
          ${this._sensorOptions(dc).map((o) => html`
            <option value=${o.id} ?selected=${o.id === val}>${o.name}</option>`)}
          ${val && !this._sensorOptions(dc).some((o) => o.id === val)
            ? html`<option value=${val} selected>${val}</option>` : nothing}
        </select>
      </div>`;
    return html`
      <div class="section-label set-collapse-h"
        @click=${() => (this._tsOpen = !this._tsOpen)}>
        <span>Temperature source</span>
        <ha-icon icon=${this._tsOpen ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </div>
      ${this._tsOpen ? html`
      <div class="set-note">
        This strip has no Spider Farmer air sensor. Use a 3rd-party Home Assistant
        temperature/humidity sensor as its reference — the readings appear on the
        card (and as <code>sensor.sf_${this.config.panel}_temperature</code> /
        <code>_humidity</code>) so you can drive the outlets from your own
        automations.
      </div>
      <div class="set-note" style="font-weight:700;color:var(--warning-color,#ff9800);margin-top:6px">
        ⚠ Important: while a 3rd-party (External) sensor is in use, control this
        device from Home Assistant only — you CANNOT use the Spider Farmer app.
        The app has no access to your 3rd-party sensor and will fight the
        integration's control.
      </div>
      <div style="display:flex;gap:8px;margin-top:4px">
        ${seg("sf", "SF sensor")}
        ${seg("external", "External sensor")}
      </div>
      ${source === "external" ? html`
        ${picker(temp, "temperature", "tsTemp", "Temperature entity")}
        ${picker(humi, "humidity", "tsHumi", "Humidity entity")}
      ` : nothing}` : nothing}`;
  }

  // Commit a staged Smart-control change from the Settings Apply bar.
  private _commitSmartControl(dr: NonNullable<SpiderFarmerCard["colorDraft"]>): void {
    const sc = dr.sc;
    if (!sc) return;
    if (JSON.stringify(sc) === JSON.stringify(this.smart || {})) return;
    const p = this.config.panel;
    const anchor = this.get(`switch.sf_${p}_dehumidifier`)
      ? `switch.sf_${p}_dehumidifier`
      : `switch.sf_${p}_indicator_light`;
    const { enabled, ...settings } = sc;
    this.smart = { ...sc };   // optimistic
    this.hass?.callService("sf", "set_smart_control", {
      entity_id: anchor, enabled: !!enabled, settings,
    });
  }

  // Smart-control section: the integration's closed-loop humidity->dehumidifier
  // controller, configured here. Only shown for a device with a dehumidifier.
  // Staged into the shared Settings draft; commits on the tab's Apply bar. Reuses
  // the card's .seg / .toggle-row / collapsible styles. (v0.21.28)
  private renderSmartControl(
    d: NonNullable<SpiderFarmerCard["colorDraft"]> | null,
    stage: (patch: Partial<NonNullable<SpiderFarmerCard["colorDraft"]>>) => void,
  ) {
    const p = this.config.panel;
    if (!this.get(`switch.sf_${p}_dehumidifier`)) return nothing;
    const accent = this.accent();
    const cur: Record<string, any> = { ...(this.smart || {}), ...(d?.sc ?? {}) };
    const scStage = (patch: Record<string, any>) => stage({ sc: { ...cur, ...patch } });
    const enabled = !!cur.enabled;
    const num = (v: any, dflt: number) => (Number.isFinite(Number(v)) ? Number(v) : dflt);
    const pctRow = (label: string, key: string, dflt: number, step = 1) => html`
      <div class="toggle-row" style="margin-top:8px">
        <span>${label}</span>
        <input type="number" style="max-width:90px" step=${step}
          .value=${String(num(cur[key], dflt))}
          @change=${(e: Event) => scStage({ [key]: Number((e.target as HTMLInputElement).value) })} />
      </div>`;
    const minRow = (label: string, key: string, dfltSec: number) => html`
      <div class="toggle-row" style="margin-top:8px">
        <span>${label} <span style="color:var(--secondary-text-color)">(min)</span></span>
        <input type="number" style="max-width:90px" step="0.5" min="0"
          .value=${String(Math.round((num(cur[key], dfltSec) / 60) * 10) / 10)}
          @change=${(e: Event) => scStage({ [key]: Math.round(Number((e.target as HTMLInputElement).value) * 60) })} />
      </div>`;
    return html`
      <div class="section-label set-collapse-h"
        @click=${() => (this._smartOpen = !this._smartOpen)}>
        <span>Smart control</span>
        <ha-icon icon=${this._smartOpen ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </div>
      ${this._smartOpen ? html`
      <div class="set-note" style="color:var(--warning-color,#ff9800)">
        ⚠ When enabled, the integration drives the dehumidifier itself (full Manual)
        to hold your humidity target — this overrides Spider Farmer's own automation.
        It runs continuously in Home Assistant (works with no dashboard open). On an
        HA restart the gear holds its last state until HA is back.
      </div>
      <div class="toggle-row">
        <span>Enable smart humidity control</span>
        <button class="toggle ${enabled ? "on" : ""}"
          style=${enabled ? `background:${accent}` : nothing}
          @click=${() => scStage({ enabled: !enabled })}></button>
      </div>
      ${enabled ? html`
        <div class="toggle-row" style="margin-top:8px">
          <span>Humidity sensor</span>
          <select style="max-width:60%"
            @change=${(e: Event) => scStage({ humidity: (e.target as HTMLSelectElement).value })}>
            <option value="" ?selected=${!cur.humidity}>Strip sensor (default)</option>
            ${this._sensorOptions("humidity").map((o) => html`
              <option value=${o.id} ?selected=${o.id === cur.humidity}>${o.name}</option>`)}
            ${cur.humidity && !this._sensorOptions("humidity").some((o) => o.id === cur.humidity)
              ? html`<option value=${cur.humidity} selected>${cur.humidity}</option>` : nothing}
          </select>
        </div>
        ${pctRow("Target humidity %", "target", 55)}
        ${pctRow("Deadband % (turn on above target+this)", "deadband", 5)}
        ${minRow("Escalate to High after", "escalate_after_s", 300)}
        ${pctRow("…if RH hasn't dropped this %", "escalate_drop", 1, 0.5)}
        ${pctRow("Ease back to Low within % of target", "ease_band", 3)}
        ${minRow("Minimum on time", "min_on_s", 120)}
        ${minRow("Minimum off time", "min_off_s", 120)}
      ` : nothing}` : nothing}`;
  }

  // Collapsible Settings section header (chevron toggles the given @state flag).
  private setHead(open: boolean, label: string, onClick: () => void) {
    return html`
      <div class="section-label set-collapse-h" style="margin-top:16px" @click=${onClick}>
        <span>${label}</span>
        <ha-icon icon=${open ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </div>`;
  }
  private renderSettings() {
    const accent = this.accent();
    // Draft-aware displayed values; committed only on Apply.
    const d = this.colorDraft;
    const mode = d?.mode ?? this.colorMode;
    const modeIn = d?.modeIn ?? this.colorModeIn;
    const hi = d?.hi ?? this.colHi;
    const lo = d?.lo ?? this.colLo;
    const inC = d?.in ?? this.colIn;
    const warn = d?.warn ?? this.colWarn;
    const showTrend = d?.showTrend ?? this.showTrend;
    const showBand = d?.showBand ?? this.showBand;
    const showTargets = d?.showTargets ?? this.showTargets;
    const tileSummary = d?.tileSummary ?? this.tileSummary;
    const hour12 = d?.hour12 ?? this.hour12;
    const showConn = d?.showConn ?? this.showConn;
    const connCustom = d?.connCustom ?? this.connCustom;
    const connSignal = d?.connSignal ?? this.connSignal;
    const showOutletsLog = d?.showOutletsLog ?? this.showOutletsLog;
    const showOutletQuick = d?.showOutletQuick ?? this.showOutletQuick;
    const outletQuickRemember = d?.outletQuickRemember ?? this.outletQuickRemember;
    const outletQuickNames = d?.outletQuickNames ?? this.outletQuickNames;
    const showVpd = d?.showVpd ?? this.showVpd;
    const vpdLeaf = d?.vpdLeaf ?? this.vpdLeaf;
    const showLeafVpd = d?.showLeafVpd ?? this.showLeafVpd;
    const showDeviceLog = d?.showDeviceLog ?? this.showDeviceLog;
    const showDeviceQuick = d?.showDeviceQuick ?? this.showDeviceQuick;
    const deviceQuickRemember = d?.deviceQuickRemember ?? this.deviceQuickRemember;
    const customNames = d?.customNames ?? this.customOutletNames;
    const customLayout = d?.customLayout ?? this.customLayout;
    const scale = d?.scale ?? this.cardScale;
    const cols = d?.cols ?? this.tileCols;
    const layoutMode = d?.layoutMode ?? this.layoutMode;
    const unifiedDeviceQuick = d?.unifiedDeviceQuick ?? this.unifiedDeviceQuick;
    const unifiedOutletQuick = d?.unifiedOutletQuick ?? this.unifiedOutletQuick;
    const tileRadius = d?.tileRadius ?? this.tileRadius;
    const tileBorderW = d?.tileBorderW ?? this.tileBorderW;
    const tileBorderCol = d?.tileBorderCol ?? this.tileBorderCol;
    const tileBg = d?.tileBg ?? this.tileBg;
    const taTiles = d?.taTiles ?? this.taTiles;
    const taDevices = d?.taDevices ?? this.taDevices;
    const taOutlets = d?.taOutlets ?? this.taOutlets;
    const cdShow = d?.cdShow ?? this.cooldownShow;
    const cdDevice = d?.cdDevice ?? this.cooldownDevice;
    const cdOutlet = d?.cdOutlet ?? this.cooldownOutlet;
    const cdSecs = d?.cdSecs ?? this.cooldownSecs;
    const ovOutlets = d?.ovOutlets ?? this.outletsOnOverview;
    const ovQuick = d?.ovQuick ?? this.outletQuickOverview;
    const hideEnergy = d?.hideEnergy ?? this.hideEnergyTile;
    const hasLight2 = !!this.get(this.eid("light", "light_2"));
    // Outlet-only strips hide the sensor/climate-specific settings sections.
    const outletOnly = this.outletOnly();
    const omode = d?.omode ?? this.outletColorMode;
    const ocM = d?.ocManual ?? this.ocManual;
    const ocS = d?.ocSched ?? this.ocSched;
    const ocE = d?.ocEnv ?? this.ocEnv;
    const ocD = d?.ocDrip ?? this.ocDrip;
    const hasOutlets = this.hasOutlets();
    const dmode = d?.dmode ?? this.deviceColorMode;
    const dcM = d?.dcManual ?? this.dcManual;
    const dcS = d?.dcSched ?? this.dcSched;
    const dcA = d?.dcAuto ?? this.dcAuto;
    const hasDevices = this.overviewDevices().length > 0;
    const dirty = !!d && (
      (d.mode !== undefined && d.mode !== this.colorMode)
      || (d.modeIn !== undefined && d.modeIn !== this.colorModeIn)
      || (d.source !== undefined && d.source !== this.colorSource)
      || (d.warn !== undefined && d.warn !== this.colWarn)
      || (d.showTrend !== undefined && d.showTrend !== this.showTrend)
      || (d.showBand !== undefined && d.showBand !== this.showBand)
      || (d.showTargets !== undefined && d.showTargets !== this.showTargets)
      || (d.tileSummary !== undefined && d.tileSummary !== this.tileSummary)
      || (d.hour12 !== undefined && d.hour12 !== this.hour12)
      || (d.showConn !== undefined && d.showConn !== this.showConn)
      || (d.connCustom !== undefined && d.connCustom !== this.connCustom)
      || (d.connSignal !== undefined && d.connSignal !== this.connSignal)
      || (d.showOutletsLog !== undefined && d.showOutletsLog !== this.showOutletsLog)
      || (d.showOutletQuick !== undefined && d.showOutletQuick !== this.showOutletQuick)
      || (d.outletQuickRemember !== undefined && d.outletQuickRemember !== this.outletQuickRemember)
      || (d.outletQuickNames !== undefined && d.outletQuickNames !== this.outletQuickNames)
      || (d.showVpd !== undefined && d.showVpd !== this.showVpd)
      || (d.showLeafVpd !== undefined && d.showLeafVpd !== this.showLeafVpd)
      || (d.showDeviceLog !== undefined && d.showDeviceLog !== this.showDeviceLog)
      || (d.showDeviceQuick !== undefined && d.showDeviceQuick !== this.showDeviceQuick)
      || (d.deviceQuickRemember !== undefined && d.deviceQuickRemember !== this.deviceQuickRemember)
      || (d.vpdLeaf !== undefined && d.vpdLeaf !== this.vpdLeaf)
      || (d.hi !== undefined && d.hi !== this.colHi)
      || (d.lo !== undefined && d.lo !== this.colLo)
      || (d.in !== undefined && d.in !== this.colIn)
      || (d.hide2 !== undefined && d.hide2 !== this.hideLight2)
      || (d.customNames !== undefined && d.customNames !== this.customOutletNames)
      || (d.customLayout !== undefined && d.customLayout !== this.customLayout)
      || (d.scale !== undefined && d.scale !== this.cardScale)
      || (d.cols !== undefined && d.cols !== this.tileCols)
      || (d.layoutMode !== undefined && d.layoutMode !== this.layoutMode)
      || (d.unifiedDeviceQuick !== undefined && d.unifiedDeviceQuick !== this.unifiedDeviceQuick)
      || (d.unifiedOutletQuick !== undefined && d.unifiedOutletQuick !== this.unifiedOutletQuick)
      || (d.omode !== undefined && d.omode !== this.outletColorMode)
      || (d.ocManual !== undefined && d.ocManual !== this.ocManual)
      || (d.ocSched !== undefined && d.ocSched !== this.ocSched)
      || (d.ocEnv !== undefined && d.ocEnv !== this.ocEnv)
      || (d.ocDrip !== undefined && d.ocDrip !== this.ocDrip)
      || (d.dmode !== undefined && d.dmode !== this.deviceColorMode)
      || (d.dcManual !== undefined && d.dcManual !== this.dcManual)
      || (d.dcSched !== undefined && d.dcSched !== this.dcSched)
      || (d.dcAuto !== undefined && d.dcAuto !== this.dcAuto)
      || (d.tileRadius !== undefined && d.tileRadius !== this.tileRadius)
      || (d.tileBorderW !== undefined && d.tileBorderW !== this.tileBorderW)
      || (d.tileBorderCol !== undefined && d.tileBorderCol !== this.tileBorderCol)
      || (d.tileBg !== undefined && d.tileBg !== this.tileBg)
      || (d.taTiles !== undefined && d.taTiles !== this.taTiles)
      || (d.taDevices !== undefined && d.taDevices !== this.taDevices)
      || (d.taOutlets !== undefined && d.taOutlets !== this.taOutlets)
      || (d.cdShow !== undefined && d.cdShow !== this.cooldownShow)
      || (d.cdDevice !== undefined && d.cdDevice !== this.cooldownDevice)
      || (d.cdOutlet !== undefined && d.cdOutlet !== this.cooldownOutlet)
      || (d.cdSecs !== undefined && d.cdSecs !== this.cooldownSecs)
      || (d.ovOutlets !== undefined && d.ovOutlets !== this.outletsOnOverview)
      || (d.ovQuick !== undefined && d.ovQuick !== this.outletQuickOverview)
      || (d.hideEnergy !== undefined && d.hideEnergy !== this.hideEnergyTile)
      || (d.tsSource !== undefined && d.tsSource !== this.tempSource)
      || (d.tsTemp !== undefined && d.tsTemp !== this.extTemp)
      || (d.tsHumi !== undefined && d.tsHumi !== this.extHumi)
      || (d.sc !== undefined && JSON.stringify(d.sc) !== JSON.stringify(this.smart || {})));
    const stage = (patch: Partial<NonNullable<typeof this.colorDraft>>) =>
      (this.colorDraft = { ...(this.colorDraft ?? {}), ...patch });
    const seg = (cur: ColorMode, m: ColorMode, label: string, icon: string,
      pick: () => void) => html`
      <button class="seg ${cur === m ? "on" : ""}"
        style=${cur === m ? `border-color:${accent};color:${accent}` : nothing}
        @click=${pick}>
        <ha-icon icon=${icon}></ha-icon><span>${label}</span>
      </button>`;
    const src = d?.source ?? this.colorSource;
    const srcSeg = (m: ColorSource, label: string, icon: string) => html`
      <button class="seg ${src === m ? "on" : ""}"
        style=${src === m ? `border-color:${accent};color:${accent}` : nothing}
        @click=${() => stage({ source: m })}>
        <ha-icon icon=${icon}></ha-icon><span>${label}</span>
      </button>`;
    const swatch = (label: string, value: string, oninput: (v: string) => void) => html`
      <label class="color-field">
        <span>${label}</span>
        <input class="pinwheel" type="color" .value=${value}
          @input=${(ev: Event) => oninput((ev.target as HTMLInputElement).value)} />
      </label>`;
    const apply = () => {
      const dr = this.colorDraft;
      if (dr) {
        if (dr.mode !== undefined && dr.mode !== this.colorMode) {
          this.colorMode = dr.mode; this.persistColorOption("colors", dr.mode);
        }
        if (dr.modeIn !== undefined && dr.modeIn !== this.colorModeIn) {
          this.colorModeIn = dr.modeIn; this.persistColorOption("colors_in", dr.modeIn);
        }
        if (dr.source !== undefined && dr.source !== this.colorSource) {
          this.colorSource = dr.source; this.persistColorOption("color_source", dr.source);
        }
        if (dr.warn !== undefined && dr.warn !== this.colWarn) {
          this.colWarn = dr.warn; this.persistColorOption("color_warn", dr.warn);
        }
        if (dr.showTrend !== undefined && dr.showTrend !== this.showTrend) {
          this.showTrend = dr.showTrend;
          this.persistColorOption("show_trend", dr.showTrend ? "1" : "0");
        }
        if (dr.showBand !== undefined && dr.showBand !== this.showBand) {
          this.showBand = dr.showBand;
          this.persistColorOption("show_band", dr.showBand ? "1" : "0");
        }
        if (dr.showTargets !== undefined && dr.showTargets !== this.showTargets) {
          this.showTargets = dr.showTargets;
          this.persistColorOption("show_targets", dr.showTargets ? "1" : "0");
        }
        if (dr.tileSummary !== undefined && dr.tileSummary !== this.tileSummary) {
          this.tileSummary = dr.tileSummary;
          this.persistColorOption("tile_summary", dr.tileSummary ? "1" : "0");
        }
        if (dr.showConn !== undefined && dr.showConn !== this.showConn) {
          this.showConn = dr.showConn;
          this.persistColorOption("show_conn", dr.showConn ? "1" : "0");
        }
        if (dr.connCustom !== undefined && dr.connCustom !== this.connCustom) {
          this.connCustom = dr.connCustom;
          this.persistColorOption("conn_custom", dr.connCustom ? "1" : "0");
        }
        if (dr.connSignal !== undefined && dr.connSignal !== this.connSignal) {
          this.connSignal = dr.connSignal;
          this.persistColorOption("conn_signal", dr.connSignal);
        }
        if (dr.showOutletsLog !== undefined && dr.showOutletsLog !== this.showOutletsLog) {
          this.showOutletsLog = dr.showOutletsLog;
          this.persistColorOption("outlets_log", dr.showOutletsLog ? "1" : "0");
        }
        if (dr.showOutletQuick !== undefined && dr.showOutletQuick !== this.showOutletQuick) {
          this.showOutletQuick = dr.showOutletQuick;
          this.persistColorOption("outlet_quick", dr.showOutletQuick ? "1" : "0");
        }
        if (dr.outletQuickRemember !== undefined && dr.outletQuickRemember !== this.outletQuickRemember) {
          this.outletQuickRemember = dr.outletQuickRemember;
          this.persistColorOption("outlet_quick_remember", dr.outletQuickRemember ? "1" : "0");
        }
        if (dr.outletQuickNames !== undefined && dr.outletQuickNames !== this.outletQuickNames) {
          this.outletQuickNames = dr.outletQuickNames;
          this.persistColorOption("outlet_quick_names", dr.outletQuickNames ? "1" : "0");
        }
        if (dr.showVpd !== undefined && dr.showVpd !== this.showVpd) {
          this.showVpd = dr.showVpd;
          this.persistColorOption("vpd_graph", dr.showVpd ? "1" : "0");
        }
        if (dr.vpdLeaf !== undefined && dr.vpdLeaf !== this.vpdLeaf) {
          this.vpdLeaf = dr.vpdLeaf;
          this.persistColorOption("vpd_leaf", dr.vpdLeaf ? "1" : "0");
        }
        if (dr.showLeafVpd !== undefined && dr.showLeafVpd !== this.showLeafVpd) {
          this.showLeafVpd = dr.showLeafVpd;
          this.persistColorOption("leaf_vpd_tile", dr.showLeafVpd ? "1" : "0");
        }
        if (dr.showDeviceLog !== undefined && dr.showDeviceLog !== this.showDeviceLog) {
          this.showDeviceLog = dr.showDeviceLog;
          this.persistColorOption("device_log", dr.showDeviceLog ? "1" : "0");
        }
        if (dr.showDeviceQuick !== undefined && dr.showDeviceQuick !== this.showDeviceQuick) {
          this.showDeviceQuick = dr.showDeviceQuick;
          this.persistColorOption("device_quick", dr.showDeviceQuick ? "1" : "0");
        }
        if (dr.deviceQuickRemember !== undefined && dr.deviceQuickRemember !== this.deviceQuickRemember) {
          this.deviceQuickRemember = dr.deviceQuickRemember;
          this.persistColorOption("device_quick_remember", dr.deviceQuickRemember ? "1" : "0");
        }
        if (dr.hour12 !== undefined && dr.hour12 !== this.hour12) {
          this.hour12 = dr.hour12;
          this.persistColorOption("time_12h", dr.hour12 ? "1" : "0");
        }
        if (dr.hi !== undefined && dr.hi !== this.colHi) {
          this.colHi = dr.hi; this.persistColorOption("color_hi", dr.hi);
        }
        if (dr.lo !== undefined && dr.lo !== this.colLo) {
          this.colLo = dr.lo; this.persistColorOption("color_lo", dr.lo);
        }
        if (dr.in !== undefined && dr.in !== this.colIn) {
          this.colIn = dr.in; this.persistColorOption("color_in", dr.in);
        }
        if (dr.hide2 !== undefined && dr.hide2 !== this.hideLight2) {
          this.hideLight2 = dr.hide2;
          this.persistColorOption("hide_light2", dr.hide2 ? "1" : "0");
        }
        if (dr.customNames !== undefined && dr.customNames !== this.customOutletNames) {
          this.customOutletNames = dr.customNames;
          this.persistColorOption("custom_outlet_names", dr.customNames ? "1" : "0");
        }
        if (dr.customLayout !== undefined && dr.customLayout !== this.customLayout) {
          this.customLayout = dr.customLayout;
          this.persistColorOption("custom_layout", dr.customLayout ? "1" : "0");
        }
        if (dr.scale !== undefined && dr.scale !== this.cardScale) {
          this.cardScale = dr.scale; this.persistColorOption("card_scale", String(dr.scale));
        }
        if (dr.cols !== undefined && dr.cols !== this.tileCols) {
          this.tileCols = dr.cols; this.persistColorOption("tile_cols", String(dr.cols));
        }
        if (dr.layoutMode !== undefined && dr.layoutMode !== this.layoutMode) {
          this.layoutMode = dr.layoutMode; this.persistColorOption("layout_mode", dr.layoutMode);
        }
        if (dr.unifiedDeviceQuick !== undefined && dr.unifiedDeviceQuick !== this.unifiedDeviceQuick) {
          this.unifiedDeviceQuick = dr.unifiedDeviceQuick;
          this.persistColorOption("unified_dev_quick", dr.unifiedDeviceQuick ? "1" : "0");
        }
        if (dr.unifiedOutletQuick !== undefined && dr.unifiedOutletQuick !== this.unifiedOutletQuick) {
          this.unifiedOutletQuick = dr.unifiedOutletQuick;
          this.persistColorOption("unified_outlet_quick", dr.unifiedOutletQuick ? "1" : "0");
        }
        if (dr.tileRadius !== undefined && dr.tileRadius !== this.tileRadius) {
          this.tileRadius = dr.tileRadius; this.persistColorOption("tile_radius", String(dr.tileRadius));
        }
        if (dr.tileBorderW !== undefined && dr.tileBorderW !== this.tileBorderW) {
          this.tileBorderW = dr.tileBorderW; this.persistColorOption("tile_border_w", String(dr.tileBorderW));
        }
        if (dr.tileBorderCol !== undefined && dr.tileBorderCol !== this.tileBorderCol) {
          this.tileBorderCol = dr.tileBorderCol; this.persistColorOption("tile_border_col", dr.tileBorderCol);
        }
        if (dr.tileBg !== undefined && dr.tileBg !== this.tileBg) {
          this.tileBg = dr.tileBg; this.persistColorOption("tile_bg", dr.tileBg);
        }
        if (dr.taTiles !== undefined && dr.taTiles !== this.taTiles) {
          this.taTiles = dr.taTiles; this.persistColorOption("ta_tiles", dr.taTiles ? "1" : "0");
        }
        if (dr.taDevices !== undefined && dr.taDevices !== this.taDevices) {
          this.taDevices = dr.taDevices; this.persistColorOption("ta_devices", dr.taDevices ? "1" : "0");
        }
        if (dr.taOutlets !== undefined && dr.taOutlets !== this.taOutlets) {
          this.taOutlets = dr.taOutlets; this.persistColorOption("ta_outlets", dr.taOutlets ? "1" : "0");
        }
        if (dr.cdShow !== undefined && dr.cdShow !== this.cooldownShow) {
          this.cooldownShow = dr.cdShow; this.persistColorOption("cooldown_show", dr.cdShow ? "1" : "0");
        }
        if (dr.cdDevice !== undefined && dr.cdDevice !== this.cooldownDevice) {
          this.cooldownDevice = dr.cdDevice; this.persistColorOption("cooldown_device", dr.cdDevice ? "1" : "0");
        }
        if (dr.cdOutlet !== undefined && dr.cdOutlet !== this.cooldownOutlet) {
          this.cooldownOutlet = dr.cdOutlet; this.persistColorOption("cooldown_outlet", dr.cdOutlet ? "1" : "0");
        }
        if (dr.cdSecs !== undefined && dr.cdSecs !== this.cooldownSecs) {
          this.cooldownSecs = dr.cdSecs; this.persistColorOption("cooldown_secs", String(dr.cdSecs));
        }
        if (dr.ovOutlets !== undefined && dr.ovOutlets !== this.outletsOnOverview) {
          this.outletsOnOverview = dr.ovOutlets;
          this.persistColorOption("overview_outlets", dr.ovOutlets ? "1" : "0");
        }
        if (dr.ovQuick !== undefined && dr.ovQuick !== this.outletQuickOverview) {
          this.outletQuickOverview = dr.ovQuick;
          this.persistColorOption("overview_quick", dr.ovQuick ? "1" : "0");
        }
        if (dr.hideEnergy !== undefined && dr.hideEnergy !== this.hideEnergyTile) {
          this.hideEnergyTile = dr.hideEnergy;
          this.persistColorOption("hide_energy_tile", dr.hideEnergy ? "1" : "0");
        }
        if (dr.omode !== undefined && dr.omode !== this.outletColorMode) {
          this.outletColorMode = dr.omode; this.persistColorOption("outlet_colors", dr.omode);
        }
        if (dr.ocManual !== undefined && dr.ocManual !== this.ocManual) {
          this.ocManual = dr.ocManual; this.persistColorOption("oc_manual", dr.ocManual);
        }
        if (dr.ocSched !== undefined && dr.ocSched !== this.ocSched) {
          this.ocSched = dr.ocSched; this.persistColorOption("oc_sched", dr.ocSched);
        }
        if (dr.ocEnv !== undefined && dr.ocEnv !== this.ocEnv) {
          this.ocEnv = dr.ocEnv; this.persistColorOption("oc_env", dr.ocEnv);
        }
        if (dr.ocDrip !== undefined && dr.ocDrip !== this.ocDrip) {
          this.ocDrip = dr.ocDrip; this.persistColorOption("oc_drip", dr.ocDrip);
        }
        if (dr.dmode !== undefined && dr.dmode !== this.deviceColorMode) {
          this.deviceColorMode = dr.dmode; this.persistColorOption("device_colors", dr.dmode);
        }
        if (dr.dcManual !== undefined && dr.dcManual !== this.dcManual) {
          this.dcManual = dr.dcManual; this.persistColorOption("dc_manual", dr.dcManual);
        }
        if (dr.dcSched !== undefined && dr.dcSched !== this.dcSched) {
          this.dcSched = dr.dcSched; this.persistColorOption("dc_sched", dr.dcSched);
        }
        if (dr.dcAuto !== undefined && dr.dcAuto !== this.dcAuto) {
          this.dcAuto = dr.dcAuto; this.persistColorOption("dc_auto", dr.dcAuto);
        }
        this._commitTempSource(dr);   // temperature source (via sf.set_strip_sensor)
        this._commitSmartControl(dr); // smart control (via sf.set_smart_control)
        this._colorSynced = true;   // this pick is authoritative until it lands
        this.cacheColors();
      }
      this.colorDraft = null;
    };
    const secTemp = this.renderTempSource(d, stage);
    const secSmart = this.renderSmartControl(d, stage);
    const secColour = html`
      <div class="section-label set-collapse-h"
        @click=${() => (this._colorOpen = !this._colorOpen)}>
        <span>Colours &amp; tile appearance</span>
        <ha-icon icon=${this._colorOpen ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </div>
      ${this._colorOpen ? html`
      ${outletOnly ? nothing : html`
      <div class="section-label">Colour by</div>
      <div class="set-note">
        What drives the tile highlight —
        <span style="color:${this.accent()}">Alarms</span> (the controller's alarm
        limits on the Alerts tab),
        <span style="color:${this.accent()}">Targets</span> (the environment
        day/night target ± dead zone), or
        <span style="color:${this.accent()}">Both</span> (an active alarm wins;
        targets colour everything else). Targets add a small “target …” line to
        Temp / Humidity / CO2 tiles.
      </div>
      <div class="seg-row">
        ${srcSeg("alarms", "Alarms", "mdi:bell-outline")}
        ${srcSeg("targets", "Targets", "mdi:target")}
        ${srcSeg("both", "Both", "mdi:set-center")}
      </div>

      <div class="section-label" style="margin-top:16px">Out-of-range highlight</div>
      <div class="set-note">
        Colour an Overview reading when it crosses its alarm limits —
        <span style="color:${hi}">above max</span>,
        <span style="color:${lo}">below min</span>. Saved to the controller, so
        it sticks across upgrades and your other devices.
      </div>
      <div class="seg-row">
        ${seg(mode, "off", "No color", "mdi:circle-off-outline", () => stage({ mode: "off" }))}
        ${seg(mode, "tile", "Tile color", "mdi:square-rounded", () => stage({ mode: "tile" }))}
        ${seg(mode, "text", "Text color", "mdi:format-color-text", () => stage({ mode: "text" }))}
      </div>
      <div class="color-row">
        ${swatch("Above max", hi, (v) => stage({ hi: v }))}
        ${swatch("Below min", lo, (v) => stage({ lo: v }))}
        ${swatch("Near edge", warn, (v) => stage({ warn: v }))}
      </div>

      <div class="section-label" style="margin-top:16px">In-range highlight</div>
      <div class="set-note">
        Colour a reading that's <span style="color:${inC}">within</span> its
        limits. Applies to every reading; off by default.
      </div>
      <div class="seg-row">
        ${seg(modeIn, "off", "No color", "mdi:circle-off-outline", () => stage({ modeIn: "off" }))}
        ${seg(modeIn, "tile", "Tile color", "mdi:square-rounded", () => stage({ modeIn: "tile" }))}
        ${seg(modeIn, "text", "Text color", "mdi:format-color-text", () => stage({ modeIn: "text" }))}
      </div>
      <div class="color-row">
        ${swatch("In range", inC, (v) => stage({ in: v }))}
      </div>
      `}

      ${hasLight2
        ? html`
            <div class="section-label" style="margin-top:16px">Devices</div>
            <div class="set-note">
              A phantom Light 2 or Fan tile? Manage per-device accessories in the
              integration: Settings → Devices &amp; services → Spider Farmer
              Bridge → Configure → “Device accessories”. HA then skips the
              entity entirely.
            </div>`
        : nothing}

      ${hasOutlets
        ? html`
            <div class="section-label" style="margin-top:16px">Outlet active color</div>
            <div class="set-note">
              Colour an outlet tile while it's on, by its mode —
              <span style="color:${ocM}">Manual</span>,
              <span style="color:${ocS}">Scheduled</span>,
              <span style="color:${ocE}">Environment</span>,
              <span style="color:${ocD}">Drip</span>. Off outlets stay neutral.
            </div>
            <div class="seg-row">
              ${seg(omode, "off", "No color", "mdi:circle-off-outline", () => stage({ omode: "off" }))}
              ${seg(omode, "tile", "Tile color", "mdi:square-rounded", () => stage({ omode: "tile" }))}
              ${seg(omode, "text", "Text color", "mdi:format-color-text", () => stage({ omode: "text" }))}
            </div>
            <div class="color-row">
              ${swatch("Manual", ocM, (v) => stage({ ocManual: v }))}
              ${swatch("Scheduled", ocS, (v) => stage({ ocSched: v }))}
            </div>
            <div class="color-row">
              ${swatch("Environment", ocE, (v) => stage({ ocEnv: v }))}
              ${swatch("Drip", ocD, (v) => stage({ ocDrip: v }))}
            </div>`
        : nothing}

      ${hasDevices
        ? html`
            <div class="section-label" style="margin-top:16px">Device active color</div>
            <div class="set-note">
              Colour a device tile while it's on, by its mode —
              <span style="color:${dcM}">Manual</span>,
              <span style="color:${dcS}">Scheduled</span>,
              <span style="color:${dcA}">Auto</span> (Environment / PPFD). A
              <span style="color:${ALARM_HI}">fault</span> always overrides.
            </div>
            <div class="seg-row">
              ${seg(dmode, "off", "No color", "mdi:circle-off-outline", () => stage({ dmode: "off" }))}
              ${seg(dmode, "tile", "Tile color", "mdi:square-rounded", () => stage({ dmode: "tile" }))}
              ${seg(dmode, "text", "Text color", "mdi:format-color-text", () => stage({ dmode: "text" }))}
            </div>
            <div class="color-row">
              ${swatch("Manual", dcM, (v) => stage({ dcManual: v }))}
              ${swatch("Scheduled", dcS, (v) => stage({ dcSched: v }))}
              ${swatch("Auto", dcA, (v) => stage({ dcAuto: v }))}
            </div>`
        : nothing}

      <div class="section-label" style="margin-top:16px">Tile appearance</div>
      <div class="set-note">Edges, border, and background for every tile.</div>
      <div class="set-note" style="margin-top:6px;display:flex;justify-content:space-between">
        <span>Corner radius</span><span style="color:${accent};font-weight:500">${tileRadius}px</span>
      </div>
      <input type="range" min="0" max="20" step="1" .value=${String(tileRadius)} style="width:100%"
        @input=${(e: Event) => stage({ tileRadius: Number((e.target as HTMLInputElement).value) })} />
      <div class="set-note" style="margin-top:8px;display:flex;justify-content:space-between">
        <span>Border width</span><span style="color:${accent};font-weight:500">${tileBorderW}px</span>
      </div>
      <input type="range" min="0" max="4" step="1" .value=${String(tileBorderW)} style="width:100%"
        @input=${(e: Event) => stage({ tileBorderW: Number((e.target as HTMLInputElement).value) })} />
      <div class="color-row" style="margin-top:8px">
        ${swatch("Border", tileBorderCol || accent, (v) => stage({ tileBorderCol: v }))}
        ${swatch("Background", tileBg || "#1e1e1e", (v) => stage({ tileBg: v }))}
      </div>
      <div class="ta-preview"
        style="border-radius:${tileRadius}px;border:${tileBorderW}px solid ${tileBorderCol || "transparent"};background:${tileBg || "var(--secondary-background-color)"}">
        <span style="color:${tileBg ? "#fff" : "var(--secondary-text-color)"}">Heater</span>
        <b style="color:${tileBg ? "#fff" : "var(--primary-text-color)"}">L4</b>
        <span style="font-size:10px;color:var(--secondary-text-color)">preview</span>
      </div>
      <div class="toggle-row" style="margin-top:6px">
        <span style="font-size:13px;color:var(--secondary-text-color)">Reset background &amp; border to theme</span>
        <button class="olog-rb" @click=${() => stage({ tileBg: "", tileBorderCol: "", tileBorderW: 1 })}>Reset</button>
      </div>
      <div class="set-note" style="margin-top:12px">Apply appearance to</div>
      <div class="toggle-row">
        <span>Sensor tiles</span>
        <button class="toggle ${taTiles ? "on" : ""}"
          style=${taTiles ? `background:${accent}` : nothing}
          @click=${() => stage({ taTiles: !taTiles })}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Device tiles</span>
        <button class="toggle ${taDevices ? "on" : ""}"
          style=${taDevices ? `background:${accent}` : nothing}
          @click=${() => stage({ taDevices: !taDevices })}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Outlet tiles</span>
        <button class="toggle ${taOutlets ? "on" : ""}"
          style=${taOutlets ? `background:${accent}` : nothing}
          @click=${() => stage({ taOutlets: !taOutlets })}></button>
      </div>
      ` : nothing}`;

    const secCooldown = this.hasDehumidifier() ? html`
      <div class="section-label set-collapse-h" style="margin-top:16px"
        @click=${() => (this._cdOpen = !this._cdOpen)}>
        <span>Dehumidifier cooldown timer</span>
        <ha-icon icon=${this._cdOpen ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
      </div>
      ${this._cdOpen ? html`
      <div class="set-note">
        Many dehumidifiers enforce a compressor lockout after switching off — they
        can't restart until it elapses, even when SF or the integration calls for
        them. Show a live countdown so you always know when it can come back on.
      </div>
      <div class="toggle-row">
        <span>Show cooldown timer</span>
        <button class="toggle ${cdShow ? "on" : ""}"
          style=${cdShow ? `background:${accent}` : nothing}
          @click=${() => stage({ cdShow: !cdShow })}></button>
      </div>
      ${cdShow ? html`
      <div class="toggle-row" style="margin-top:8px">
        <span>On device tile</span>
        <button class="toggle ${cdDevice ? "on" : ""}"
          style=${cdDevice ? `background:${accent}` : nothing}
          @click=${() => stage({ cdDevice: !cdDevice })}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>On outlet tiles</span>
        <button class="toggle ${cdOutlet ? "on" : ""}"
          style=${cdOutlet ? `background:${accent}` : nothing}
          @click=${() => stage({ cdOutlet: !cdOutlet })}></button>
      </div>
      <div class="set-note" style="margin-top:8px;display:flex;justify-content:space-between">
        <span>Cooldown length</span>
        <span style="color:${accent};font-weight:500">${(cdSecs / 60).toFixed(1).replace(/\.0$/, "")} min</span>
      </div>
      <input type="range" min="30" max="900" step="30" .value=${String(cdSecs)} style="width:100%"
        @input=${(e: Event) => stage({ cdSecs: Number((e.target as HTMLInputElement).value) })} />
      ` : nothing}
      ` : nothing}
      ` : nothing;

    const secOverview = this.hasOutlets() ? html`
      ${this.setHead(this._setOverviewOpen, "Overview", () => (this._setOverviewOpen = !this._setOverviewOpen))}
      ${this._setOverviewOpen ? html`
      <div class="set-note">
        Show everything in one view: append the outlet tiles to the Overview tab,
        at the bottom under Devices.
      </div>
      <div class="toggle-row">
        <span>Show outlets on Overview</span>
        <button class="toggle ${ovOutlets ? "on" : ""}"
          style=${ovOutlets ? `background:${accent}` : nothing}
          @click=${() => stage({ ovOutlets: !ovOutlets })}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Show quick-toggle row on Overview</span>
        <button class="toggle ${ovQuick ? "on" : ""}"
          style=${ovQuick ? `background:${accent}` : nothing}
          @click=${() => stage({ ovQuick: !ovQuick })}></button>
      </div>
      ${this.get(`sensor.sf_${this.config.panel}_power`) ? html`
      <div class="toggle-row" style="margin-top:8px">
        <span>Hide Energy Usage tile</span>
        <button class="toggle ${hideEnergy ? "on" : ""}"
          style=${hideEnergy ? `background:${accent}` : nothing}
          @click=${() => stage({ hideEnergy: !hideEnergy })}></button>
      </div>` : nothing}` : nothing}` : nothing;

    const secExtras = html`
      ${this.setHead(this._setExtrasOpen, "Tile extras", () => (this._setExtrasOpen = !this._setExtrasOpen))}
      ${this._setExtrasOpen ? html`
      <div class="set-note">
        Shown on every Overview tile, independent of the colour mode. Tap any tile
        to open its history graph (6h–7d, selectable).
      </div>
      ${outletOnly ? nothing : html`
      <div class="toggle-row">
        <span>Target / range line</span>
        <button class="toggle ${showTargets ? "on" : ""}"
          style=${showTargets ? `background:${accent}` : nothing}
          @click=${() => stage({ showTargets: !showTargets })}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Trend arrows</span>
        <button class="toggle ${showTrend ? "on" : ""}"
          style=${showTrend ? `background:${accent}` : nothing}
          @click=${() => stage({ showTrend: !showTrend })}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Dead-zone band</span>
        <button class="toggle ${showBand ? "on" : ""}"
          style=${showBand ? `background:${accent}` : nothing}
          @click=${() => stage({ showBand: !showBand })}></button>
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Device mode summary</span>
        <button class="toggle ${tileSummary ? "on" : ""}"
          style=${tileSummary ? `background:${accent}` : nothing}
          @click=${() => stage({ tileSummary: !tileSummary })}></button>
      </div>
      <div class="set-note">
        On each device tile (Blower, Fan, Heater, Humidifier, Dehumidifier,
        Lights), show a small line with its mode and key settings — so you can
        read it without opening the tile.
      </div>`}
      <div class="toggle-row" style="margin-top:8px">
        <span>12-hour time (AM/PM)</span>
        <button class="toggle ${hour12 ? "on" : ""}"
          style=${hour12 ? `background:${accent}` : nothing}
          @click=${() => stage({ hour12: !hour12 })}></button>
      </div>
      <div class="set-note">
        Show tile schedule times as 5:00am–11:00pm instead of 05:00–23:00.
      </div>` : nothing}`;

    const secHeader = html`
      ${this.setHead(this._setConnOpen, "Header connection info", () => (this._setConnOpen = !this._setConnOpen))}
      ${this._setConnOpen ? html`
      <div class="set-note">
        Show the controller's online status + Wi-Fi signal bars in the top-right
        of the header. Signal comes from the controller's own Wi-Fi — no extra
        entities are created.
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Show connection info</span>
        <button class="toggle ${showConn ? "on" : ""}"
          style=${showConn ? `background:${accent}` : nothing}
          @click=${() => stage({ showConn: !showConn })}></button>
      </div>
      ${showConn ? html`
        <div class="toggle-row" style="margin-top:8px">
          <span>Use a custom signal source</span>
          <button class="toggle ${connCustom ? "on" : ""}"
            style=${connCustom ? `background:${accent}` : nothing}
            @click=${() => stage({ connCustom: !connCustom })}></button>
        </div>
        <div class="set-note">
          Point the signal bars at a different entity — e.g. the controller is on
          another AP or hard-wired, and its dBm is reported by your router/AP
          integration instead of the bundled Wi-Fi AP.
        </div>
        ${connCustom ? html`
          <div class="toggle-row" style="margin-top:6px">
            <span>Signal entity</span>
            <select style="max-width:60%"
              @change=${(e: Event) => stage({ connSignal: (e.target as HTMLSelectElement).value })}>
              <option value="" ?selected=${!connSignal}>— none —</option>
              ${this.signalEntityOptions().map((o) => html`
                <option value=${o.id} ?selected=${connSignal === o.id}>${o.name}</option>`)}
            </select>
          </div>` : nothing}
      ` : nothing}` : nothing}`;

    const secVpd = outletOnly ? nothing : html`
      ${this.setHead(this._setVpdOpen, "VPD graph", () => (this._setVpdOpen = !this._setVpdOpen))}
      ${this._setVpdOpen ? html`
      <div class="set-note">
        Adds a "VPD" tab with a vibrant temperature × humidity phase chart (grid
        or trend) plus growth-stage targets. Uses this panel's air temp + humidity
        — no extra entities.
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Show Leaf VPD tile</span>
        <button class="toggle ${showLeafVpd ? "on" : ""}"
          style=${showLeafVpd ? `background:${accent}` : nothing}
          @click=${() => stage({ showLeafVpd: !showLeafVpd })}></button>
      </div>
      <div class="set-note">Off hides the Leaf VPD tile and its target settings.</div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Enable VPD graph</span>
        <button class="toggle ${showVpd ? "on" : ""}"
          style=${showVpd ? `background:${accent}` : nothing}
          @click=${() => stage({ showVpd: !showVpd })}></button>
      </div>
      ${showVpd ? html`
        <div class="toggle-row" style="margin-top:8px">
          <span>Enable Leaf VPD</span>
          <button class="toggle ${vpdLeaf ? "on" : ""}"
            style=${vpdLeaf ? `background:${accent}` : nothing}
            @click=${() => stage({ vpdLeaf: !vpdLeaf })}></button>
        </div>
        <div class="set-note">
          Also plots leaf VPD (from the leaf-VPD sensor) alongside air VPD on the
          tab.
        </div>` : nothing}` : nothing}`;

    const secDevices = hasDevices ? html`
      ${this.setHead(this._setDevOpen, "Devices", () => (this._setDevOpen = !this._setDevOpen))}
      ${this._setDevOpen ? html`
      <div class="toggle-row" style="margin-top:8px">
        <span>Show Device Log tab</span>
        <button class="toggle ${showDeviceLog ? "on" : ""}"
          style=${showDeviceLog ? `background:${accent}` : nothing}
          @click=${() => stage({ showDeviceLog: !showDeviceLog })}></button>
      </div>
      <div class="set-note">
        Adds a "Device Log" tab with a 24h/7d on-off timeline per device (lights,
        fan, blower, heater, humidifier, dehumidifier) from Home Assistant's
        recorder history. Tap a row for its recent events.
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Quick-toggle devices row</span>
        <button class="toggle ${showDeviceQuick ? "on" : ""}"
          style=${showDeviceQuick ? `background:${accent}` : nothing}
          @click=${() => stage({ showDeviceQuick: !showDeviceQuick })}></button>
      </div>
      <div class="set-note">
        Shows a compact row of icon buttons above the device tiles for fast
        on/off toggling.
      </div>
      ${showDeviceQuick ? html`
        <div class="toggle-row" style="margin-top:6px">
          <span>Remember device settings on toggle</span>
          <button class="toggle ${deviceQuickRemember ? "on" : ""}"
            style=${deviceQuickRemember ? `background:${accent}` : nothing}
            @click=${() => stage({ deviceQuickRemember: !deviceQuickRemember })}></button>
        </div>
        <div class="set-note">
          On quick-off, remember the device's mode; on quick-on, re-select it so the
          controller re-applies that mode's settings (instead of a bare manual on).
          Saved on the controller, so it syncs across your devices.
        </div>` : nothing}
      ` : nothing}` : nothing;

    const secOutlets = hasOutlets ? html`
      ${this.setHead(this._setOutletOpen, "Outlets", () => (this._setOutletOpen = !this._setOutletOpen))}
      ${this._setOutletOpen ? html`
      <div class="toggle-row" style="margin-top:12px">
        <span>Custom outlet names</span>
        <button class="toggle ${customNames ? "on" : ""}"
          style=${customNames ? `background:${accent}` : nothing}
          @click=${() => stage({ customNames: !customNames })}></button>
      </div>
      <div class="set-note">
        Give each outlet its own name (e.g. "Exhaust Fan", "Veg Light"), shown in
        the Outlets tab in place of "Outlet 1/2/…". Edit each name on its outlet
        after enabling. Saved to the controller, so it sticks across upgrades and
        your other devices.
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Show Outlets Log tab</span>
        <button class="toggle ${showOutletsLog ? "on" : ""}"
          style=${showOutletsLog ? `background:${accent}` : nothing}
          @click=${() => stage({ showOutletsLog: !showOutletsLog })}></button>
      </div>
      <div class="set-note">
        Adds an "Outlets Log" tab with a 24h/7d on-off timeline per outlet (from
        Home Assistant's recorder history). Tap a row to see its recent switch
        events.
      </div>
      <div class="toggle-row" style="margin-top:8px">
        <span>Quick-toggle outlets row</span>
        <button class="toggle ${showOutletQuick ? "on" : ""}"
          style=${showOutletQuick ? `background:${accent}` : nothing}
          @click=${() => stage({ showOutletQuick: !showOutletQuick })}></button>
      </div>
      <div class="set-note">
        Shows a compact row of numbered on/off buttons above the outlet tiles for
        fast toggling.
      </div>
      ${showOutletQuick ? html`
        <div class="toggle-row" style="margin-top:6px">
          <span>Show outlet names on quick buttons</span>
          <button class="toggle ${outletQuickNames ? "on" : ""}"
            style=${outletQuickNames ? `background:${accent}` : nothing}
            @click=${() => stage({ outletQuickNames: !outletQuickNames })}></button>
        </div>
        <div class="set-note">
          On: buttons show the outlet number + name (e.g. "4-Heater"), or just the
          number for unnamed outlets. Off: a status dot + number.
        </div>
        <div class="toggle-row" style="margin-top:6px">
          <span>Remember outlet settings on toggle</span>
          <button class="toggle ${outletQuickRemember ? "on" : ""}"
            style=${outletQuickRemember ? `background:${accent}` : nothing}
            @click=${() => stage({ outletQuickRemember: !outletQuickRemember })}></button>
        </div>
        <div class="set-note">
          On: quick-on restores the outlet's last mode/config (saved when you
          quick-off it). Off: plain on/off — a bare toggle reverts the outlet to
          Manual, like the device does.
        </div>` : nothing}` : nothing}` : nothing;

    const secLayout = html`
      ${this.setHead(this._setLayoutOpen, "Layout", () => (this._setLayoutOpen = !this._setLayoutOpen))}
      ${this._setLayoutOpen ? html`
      <div class="set-note">
        Resize the whole card and choose how many tiles sit per row. Saved to the
        controller, so it sticks across upgrades and your other devices.
      </div>
      <div class="toggle-row">
        <span>Custom layout</span>
        <button class="toggle ${customLayout ? "on" : ""}"
          style=${customLayout ? `background:${accent}` : nothing}
          @click=${() => stage({ customLayout: !customLayout })}></button>
      </div>
      ${customLayout ? html`
        <div class="set-note" style="margin-top:10px;display:flex;justify-content:space-between">
          <span>Scale</span><span style="color:${accent};font-weight:500">${scale}%</span>
        </div>
        <input type="range" min="70" max="150" step="5" .value=${String(scale)}
          style="width:100%"
          @input=${(e: Event) => stage({ scale: Number((e.target as HTMLInputElement).value) })} />
        <div class="set-note" style="margin-top:10px">Tiles per row</div>
        <div class="seg-row" style="grid-template-columns:repeat(4,1fr)">
          ${[2, 3, 4, 5].map((c) => html`
            <button class="seg ${cols === c ? "on" : ""}"
              style=${cols === c ? `border-color:${accent};color:${accent}` : nothing}
              @click=${() => stage({ cols: c })}><span>${c}</span></button>`)}
        </div>
        ${!this.outletOnly() ? html`
        <div class="toggle-row" style="margin-top:12px">
          <span>Free-move panel</span>
          <button class="toggle ${layoutMode === "unified" ? "on" : ""}"
            style=${layoutMode === "unified" ? `background:${accent}` : nothing}
            @click=${() => stage({ layoutMode: layoutMode === "unified" ? "sections" : "unified" })}></button>
        </div>
        <div class="set-note" style="margin-top:2px;opacity:.8">
          On: all tiles — sensors, energy, devices, outlets — merge into one grid with
          no section headings, so any tile can go anywhere. Off: tiles reorder within
          their own section (sensors, devices, outlets stay grouped).
        </div>
        ${layoutMode === "unified" && (this.overviewDevices().length || this.hasOutlets()) ? html`
        ${this.overviewDevices().length ? html`
        <div class="toggle-row" style="margin-top:10px">
          <span>Show device quick row</span>
          <button class="toggle ${unifiedDeviceQuick ? "on" : ""}"
            style=${unifiedDeviceQuick ? `background:${accent}` : nothing}
            @click=${() => stage({ unifiedDeviceQuick: !unifiedDeviceQuick })}></button>
        </div>` : nothing}
        ${this.hasOutlets() ? html`
        <div class="toggle-row" style="margin-top:6px">
          <span>Show outlet quick row</span>
          <button class="toggle ${unifiedOutletQuick ? "on" : ""}"
            style=${unifiedOutletQuick ? `background:${accent}` : nothing}
            @click=${() => stage({ unifiedOutletQuick: !unifiedOutletQuick })}></button>
        </div>` : nothing}
        <div class="set-note" style="margin-top:2px;opacity:.8">
          Adds the quick-toggle row(s) as full-width bars in the panel — draggable in
          Rearrange like any tile.
        </div>` : nothing}
        <div class="section-label" style="margin-top:16px">Rearrange tiles</div>
        <div class="set-note" style="margin-top:2px;opacity:.8">
          Drag Overview tiles to reorder them and close gaps, or tap a tile's eye icon
          to hide it. Opens Overview in rearrange mode; changes save on Apply.
        </div>
        <button class="seg" style="margin-top:8px;width:auto;padding:7px 12px"
          @click=${() => this.enterReorder()}>
          <ha-icon icon="mdi:drag-variant" style="--mdc-icon-size:18px"></ha-icon>
          <span style="margin-left:6px">Rearrange / Hide Tiles</span>
        </button>` : nothing}` : nothing}` : nothing}`;

    // Collapsible Settings sections, rendered in alphabetical order by label.
    const sections: { label: string; tpl: unknown }[] = [
      { label: "Colours & tile appearance", tpl: secColour },
      { label: "Dehumidifier cooldown timer", tpl: secCooldown },
      { label: "Devices", tpl: secDevices },
      { label: "Header connection info", tpl: secHeader },
      { label: "Layout", tpl: secLayout },
      { label: "Outlets", tpl: secOutlets },
      { label: "Overview", tpl: secOverview },
      { label: "Smart control", tpl: secSmart },
      { label: "Temperature source", tpl: secTemp },
      { label: "Tile extras", tpl: secExtras },
      { label: "VPD graph", tpl: secVpd },
    ];
    return html`
      ${sections.sort((a, b) => a.label.localeCompare(b.label)).map((s) => s.tpl)}
      ${this.saveBar(dirty, apply, () => (this.colorDraft = null), "apply-bar")}`;
  }

  static styles = css`
    ${SLIDER_BUBBLE_CSS}
    ha-card { padding: 12px 14px 16px; }
    .header {
      display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap;
      margin-bottom: 10px;
    }
    .header .title { font-size: 18px; font-weight: 500; }
    .header .device { font-size: 12px; color: var(--secondary-text-color); }
    /* Connection info: online dot + signal bars + dBm, pushed to the right edge
       of the header row. Wraps below the name on very narrow cards. */
    .header .conn {
      margin-left: auto; display: inline-flex; align-items: center; gap: 8px;
      font-size: 11px; color: var(--secondary-text-color); white-space: nowrap;
      align-self: center;
    }
    .header .conn .conn-st { display: inline-flex; align-items: center; gap: 4px; font-weight: 500; }
    .header .conn .conn-dot { width: 7px; height: 7px; border-radius: 50%; }
    .header .conn svg { display: block; }
    .header .conn .conn-eth { --mdc-icon-size: 16px; width: 16px; height: 16px; }
    /* Outlets Log tab */
    .olog-range { display: flex; gap: 6px; margin: 2px 0 10px; }
    .olog-rb {
      font: inherit; font-size: 11px; padding: 3px 10px; border-radius: 6px; cursor: pointer;
      border: 1px solid var(--divider-color, #333); background: transparent; color: var(--secondary-text-color);
    }
    .olog-row {
      display: flex; align-items: center; gap: 10px; padding: 8px 2px; cursor: pointer;
      border-bottom: 1px solid var(--divider-color, rgba(0,0,0,.1));
    }
    .olog-nm { width: 96px; flex: 0 0 auto; font-size: 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .olog-nm .olog-cur { display: block; font-size: 10px; color: var(--secondary-text-color); }
    .olog-tl {
      position: relative; flex: 1; height: 14px; border-radius: 4px; overflow: hidden;
      background: var(--secondary-background-color, #24272d);
    }
    .olog-seg { position: absolute; top: 0; bottom: 0; background: #54c06a; border-radius: 2px; }
    .olog-load { position: absolute; left: 6px; top: 0; font-size: 10px; color: var(--secondary-text-color); }
    .olog-chev { --mdc-icon-size: 18px; color: var(--secondary-text-color); flex: 0 0 auto; }
    .olog-exp { margin: 2px 0 8px 106px; border-left: 2px solid var(--divider-color, #2f333a); padding-left: 10px; }
    .olog-ev { display: flex; justify-content: space-between; font-size: 11px; color: var(--primary-text-color); padding: 2px 0; }
    .olog-ev .on { color: #54c06a; font-weight: 500; }
    .olog-ev .off { color: var(--secondary-text-color); font-weight: 500; }
    .olog-ev .dur { color: var(--secondary-text-color); }
    .olog-axis { display: flex; justify-content: space-between; font-size: 9px; color: var(--secondary-text-color); margin: 4px 0 0 106px; }
    /* Apply "saving…" spinner */
    .save-spin {
      width: 11px; height: 11px; border-radius: 50%; display: inline-block; margin-right: 6px;
      vertical-align: -1px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff;
      animation: sf-spin .7s linear infinite;
    }
    @keyframes sf-spin { to { transform: rotate(360deg); } }
    /* Quick-toggle outlets row */
    .oq-row { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin: 0 0 8px; }
    .oq-lab { font-size: 9px; color: var(--secondary-text-color); display: inline-flex; align-items: center; gap: 4px;
      border: 1px solid var(--divider-color, #2a2f31); border-radius: 8px; padding: 3px 8px; }
    .oq-lab ha-icon { --mdc-icon-size: 14px; }
    .oq-lab-lines { display: flex; flex-direction: column; line-height: 1.05; text-align: left; }
    .oq-lab-lines b { font-weight: 600; font-size: 10px; color: var(--primary-text-color); }
    .oq-btn {
      font: inherit; font-size: 11px; border-radius: 7px; padding: 4px 9px; cursor: pointer;
      display: inline-flex; align-items: center; gap: 5px;
      border: 1px solid var(--divider-color, #3a3e44); background: var(--secondary-background-color, #26292e);
      color: var(--primary-text-color);
    }
    .oq-btn .oq-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--secondary-text-color); }
    /* saved quick-toggle profile active: full green box (border + bg) + green dot + number */
    .oq-btn.on { border-color: #54c06a; background: rgba(84,192,106,.14); color: #54c06a; }
    .oq-btn.on .oq-dot { background: #54c06a; }
    /* outlet simply on (no saved profile): green dot + green number, no box */
    .oq-btn.live { color: #54c06a; }
    .oq-btn.live .oq-dot { background: #54c06a; }
    /* Copy-outlet-config panel */
    .oc-copybtn {
      font: inherit; font-size: 11px; display: inline-flex; align-items: center; gap: 4px; cursor: pointer;
      border: 1px solid var(--divider-color, #3a3e44); background: var(--secondary-background-color, #26292e);
      color: var(--primary-text-color); border-radius: 6px; padding: 3px 8px;
    }
    .oc-copybtn ha-icon { --mdc-icon-size: 15px; }
    .oc-panel { background: var(--card-background-color, #22252b); border-radius: 8px; padding: 8px 10px; margin: 6px 0 4px; }
    .oc-title { font-size: 11px; color: var(--secondary-text-color); margin-bottom: 6px; }
    .oc-ck { display: flex; align-items: center; gap: 8px; font-size: 12px; padding: 3px 0; cursor: pointer; }
    .oc-fromitem {
      display: block; width: 100%; text-align: left; font: inherit; font-size: 12px;
      background: none; border: none; color: var(--primary-text-color);
      padding: 4px 6px; border-radius: 6px; cursor: pointer;
    }
    .oc-fromitem:hover { background: var(--secondary-background-color); }
    .oc-mode { color: var(--secondary-text-color); font-size: 11px; }
    /* One column per strip; wraps to a single column on narrow widths. */
    .oc-cols { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; }
    .oc-col { min-width: 0; }
    .oc-colhd {
      font-size: 10px; letter-spacing: .04em; text-transform: uppercase;
      color: var(--secondary-text-color); padding-bottom: 4px; margin-bottom: 6px;
      border-bottom: 1px solid var(--divider-color, #2f333a);
      display: flex; align-items: center; gap: 6px;
    }
    .oc-cur {
      font-size: 9px; color: var(--sf-accent, #ff9800); text-transform: none; letter-spacing: 0;
      border: 1px solid var(--sf-accent, #ff9800); border-radius: 5px; padding: 0 5px;
    }
    .oc-apply {
      margin-top: 8px; background: var(--sf-accent, #ff9800); color: #fff; border: none;
      border-radius: 7px; font-size: 12px; padding: 5px 12px; cursor: pointer;
    }
    .oc-apply[disabled] { background: var(--divider-color, #444); color: var(--secondary-text-color); cursor: default; }
    .tabs {
      display: flex; gap: 4px; border-bottom: 1px solid var(--divider-color, #e0e0e0);
      margin-bottom: 6px;
      /* v0.17.1: with six tabs a narrow card can't fit one row. Wrap to a
         second row rather than scrolling — a half-clipped tab reads as a
         rendering bug and hides that the tab is even there. */
      flex-wrap: wrap; row-gap: 0;
    }
    .tab {
      background: none; border: none; border-bottom: 2px solid transparent;
      color: var(--secondary-text-color); font-size: 14px; font-weight: 500;
      padding: 8px 12px; cursor: pointer; margin-bottom: -1px;
      white-space: nowrap; flex: 0 0 auto;
    }
    /* ── Log tab ── */
    .log-filters { display: flex; flex-wrap: wrap; gap: 8px; margin: 6px 0 10px; }
    .log-filters .ctl { flex: 1 1 130px; }
    .log-count {
      font-size: 12px; color: var(--secondary-text-color); margin: 0 0 6px;
    }
    /* Cap the list at ~10 rows and scroll the rest, so a long history can't
       run past the bottom of the card. */
    .log-list { max-height: 560px; overflow-y: auto; padding-right: 2px; }
    .log-list::-webkit-scrollbar { width: 6px; }
    .log-list::-webkit-scrollbar-thumb {
      background: var(--divider-color, #555); border-radius: 3px;
    }
    .log-row {
      background: rgba(255,255,255,.04); border-left: 3px solid;
      border-radius: 8px; padding: 8px 10px; margin-bottom: 8px;
    }
    .log-row.raise { border-left-color: #f85149; }
    .log-row.restore { border-left-color: #3fb950; }
    .log-title { font-size: 14px; }
    .log-time {
      font-size: 12px; color: var(--secondary-text-color); margin-top: 2px;
    }
    .tab.active { border-bottom-width: 2px; border-style: solid; }
    .section-label {
      font-size: 12px; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.04em; margin: 14px 2px 8px;
    }
    /* Parameters header: label | centred light-leak alert | day/night pill. */
    .params-head { display: flex; align-items: center; gap: 8px; margin: 14px 2px 8px; }
    .params-head .ph-label {
      font-size: 12px; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.04em; white-space: nowrap;
    }
    .ph-mid { flex: 1; display: flex; justify-content: center; min-width: 0; }
    .cycle-badge, .leak-badge {
      display: inline-flex; align-items: center; gap: 4px;
      font-size: 11px; font-weight: 500; line-height: 1;
      padding: 3px 9px; border-radius: 999px; white-space: nowrap;
    }
    .cycle-badge { flex: none; }
    .cycle-badge ha-icon, .leak-badge ha-icon { --mdc-icon-size: 14px; }
    .leak-badge {
      color: #ff6b6b; background: rgba(255,107,107,0.16);
      max-width: 100%; min-width: 0; overflow: hidden; text-overflow: ellipsis;
    }
    /* minmax(0,1fr) so a wide value (e.g. "Offline") can't push a column past
       the card and clip the third column off-screen on narrow mobile. */
    /* Rows sized to content (tiles keep their own min-height, so tile rows stay
       uniform) — this lets a full-width row (a tile's inline expansion, or a
       quick-toggle bar) be its own content height instead of a tall tile row.
       Dense flow backfills the empty cells a full-width row would otherwise leave
       in its partial row, so an expanded tile / moved bar never leaves tile gaps.
       (Dense is a no-op on grids without full-width items.) */
    .grid { display: grid; grid-template-columns: repeat(var(--sf-cols, 3), minmax(0, 1fr)); grid-auto-rows: min-content; grid-auto-flow: row dense; gap: 8px; }
    /* During rearrange, use linear flow so a tile's on-screen position matches its
       order in the list — dense would reflow tiles and make drag targeting wrong. */
    .grid.rgrid { grid-auto-flow: row; }
    .tile-exp { min-width: 0; }                    /* inline tile expansion (graph/detail) */
    /* Phase 2 — rearrange mode */
    .rspan { grid-column: 1 / -1; }               /* full-width item (quick rows) */
    /* quick rows carry their own bottom margin; inside the grid the gap already
       spaces them, so drop it to avoid a double gap after the row. */
    .rspan .oq-row, .rgrid .rwrap.rfull .oq-row { margin-bottom: 0; }
    .rgrid .rwrap.rfull { grid-column: 1 / -1; align-items: center; }
    .rwrap { position: relative; display: flex; }
    .rwrap > :not(.rhandle):not(.rhide) { flex: 1 1 auto; min-width: 0; pointer-events: none; }
    .rgrid .rwrap { touch-action: none; cursor: grab; -webkit-user-select: none; user-select: none; }
    .rgrid .rwrap.dragging { opacity: .55; cursor: grabbing; outline: 2px dashed #ff7a1a; outline-offset: -2px; border-radius: var(--sf-tile-radius, 12px); }
    .rhandle { position: absolute; top: 3px; right: 3px; z-index: 3; color: var(--secondary-text-color); opacity: .75; --mdc-icon-size: 18px; pointer-events: none; }
    .rhide { position: absolute; top: 3px; left: 3px; z-index: 4; pointer-events: auto; cursor: pointer; background: var(--card-background-color, #1c1c1c); border: 1px solid var(--divider-color, #444); border-radius: 50%; width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center; color: var(--secondary-text-color); padding: 0; --mdc-icon-size: 15px; }
    .rhide:hover { color: var(--primary-text-color); border-color: var(--primary-text-color); }
    .hidden-tray { margin-top: 12px; border-top: 1px dashed var(--divider-color, #444); padding-top: 6px; }
    .hidden-tray .rwrap.rhidden { opacity: .6; }
    .ht-note { color: var(--secondary-text-color); font-size: .85em; padding: 4px 2px 8px; }
    .reorder-bar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; background: var(--secondary-background-color); border-radius: 10px; padding: 8px 10px; margin-bottom: 10px; }
    .reorder-note { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--secondary-text-color); flex: 1 1 160px; }
    .reorder-bar .save-bar { margin: 0; }
    .reorder-reset { background: transparent; border: 1px solid var(--divider-color, #2a2f31); color: var(--primary-text-color); border-radius: 8px; padding: 6px 10px; font-size: 12px; cursor: pointer; }
    .tile-val { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tile {
      background: var(--sf-tile-bg, var(--secondary-background-color));
      border-radius: var(--sf-tile-radius, 12px);
      border: var(--sf-tile-bw, 0px) solid var(--sf-tile-bc, transparent);
      padding: 10px;
      min-width: 0; overflow: hidden; min-height: 138px; box-sizing: border-box;
      position: relative;
    }
    /* Tile-appearance scope: when a category is excluded (.ta-x-* on the card),
       reset the custom-appearance vars to their invalid value on that category's
       tiles so the var() fallbacks (theme defaults) apply. A tile owns the reset
       so it wins over the inherited value from the card's inline style.
       Sensor tiles = .tile that is neither a device nor an outlet tile. */
    .ta-x-t .tile:not(.tile-device):not(.tile-outlet),
    .ta-x-d .tile.tile-device,
    .ta-x-o .tile.tile-outlet {
      --sf-tile-bg: initial;
      --sf-tile-radius: initial;
      --sf-tile-bw: initial;
      --sf-tile-bc: initial;
    }
    /* Device tiles pin their icon + value to the bottom-left so the value lines up
       across tiles regardless of how many summary lines are above it. */
    .tile-device { display: flex; flex-direction: column; }
    /* Higher specificity than ".tile ha-icon" below so the auto margin wins and
       pushes the icon + value to the bottom. */
    .tile.tile-device > ha-icon { margin-top: auto; }
    /* PPFD target + Daily Light Integral badge, lower-right of a PPFD-mode light tile. */
    .tile-dli {
      position: absolute; right: 8px; bottom: 7px; text-align: right;
      font-size: 10px; line-height: 1.4; color: var(--secondary-text-color); white-space: nowrap;
    }
    .tile-dli-v { color: var(--primary-text-color); }
    .tile-label {
      font-size: 11px; color: var(--secondary-text-color);
      display: flex; align-items: center; justify-content: space-between; gap: 3px;
      min-width: 0;
    }
    .tile-label .tl-name { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .tile-label .tl-right { display: inline-flex; align-items: center; gap: 2px; flex: 0 0 auto; }
    .tile-trend { --mdc-icon-size: 15px; margin: 0; }
    /* Dead-zone band on a tile. */
    .tile-band {
      height: 5px; border-radius: 3px; margin-top: 7px; position: relative;
      background: var(--card-background-color, #12151a); overflow: hidden;
    }
    .tile-band .bz { position: absolute; top: 0; bottom: 0; }
    .tile-band .bmark {
      position: absolute; top: -2px; width: 2px; height: 9px;
      background: var(--primary-text-color); border-radius: 1px;
      transform: translateX(-50%);
    }
    /* Inline tap-for-graph history sparkline. */
    .param-graph {
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 10px 12px; margin-top: 8px;
    }
    .param-graph .pg-head {
      display: flex; align-items: center; gap: 8px;
      font-size: 12px; color: var(--secondary-text-color); margin-bottom: 4px;
    }
    .param-graph .pg-head > span:first-child { flex: 1; }
    .param-graph .pg-now { font-size: 15px; font-weight: 500; }
    .param-graph .pg-now .pg-u { font-size: 10px; color: var(--secondary-text-color); margin-left: 1px; }
    .param-graph .pg-head ha-icon { --mdc-icon-size: 18px; cursor: pointer; }
    .param-graph .pg-stats {
      display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 6px;
      font-size: 11px; color: var(--secondary-text-color);
    }
    .param-graph .pg-stats b { color: var(--primary-text-color); font-weight: 500; }
    .param-graph .pg-plot { display: flex; align-items: stretch; gap: 6px; }
    .param-graph .pg-yax {
      display: flex; flex-direction: column; justify-content: space-between;
      font-size: 10px; color: var(--secondary-text-color); text-align: right;
      min-width: 30px; padding: 1px 0;
    }
    /* touch-action:none so a finger drag scrubs the cursor instead of scrolling
       the page (otherwise the first touchmove starts a scroll and the pointer
       events are cancelled, so the slider never moves on mobile). (v0.21.73) */
    .param-graph .pg-svg { flex: 1; width: 100%; height: 120px; display: block; touch-action: none; }
    .param-graph .pg-xax {
      display: flex; justify-content: space-between; margin: 3px 0 0 36px;
      font-size: 10px; color: var(--secondary-text-color);
    }
    .param-graph .pg-note { font-size: 13px; color: var(--secondary-text-color); }
    /* Legend for the multi-line soil graph: a swatch + name + the value at the
       cursor (or live value when not scrubbing). The average uses a bar swatch,
       probes a dot. (v0.21.74) */
    .param-graph .pg-legend {
      display: flex; flex-wrap: wrap; gap: 10px; margin: 6px 0 0 36px;
      font-size: 11px; color: var(--secondary-text-color);
    }
    .param-graph .pg-leg { display: inline-flex; align-items: center; gap: 5px; }
    .param-graph .pg-leg i { width: 9px; height: 9px; border-radius: 50%; display: inline-block; flex: none; }
    .param-graph .pg-leg.avg i { width: 14px; height: 3px; border-radius: 2px; }
    .param-graph .pg-leg b { color: var(--primary-text-color); font-weight: 500; }
    .tile .soil-graph-btn, .tile .device-graph-btn { cursor: pointer; }
    .tile ha-icon { --mdc-icon-size: 20px; display: block; margin: 2px 0; }
    .tile-val { font-size: 17px; font-weight: 500; }
    .tile-sub {
      font-size: 11px; color: var(--secondary-text-color); margin-top: 2px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    /* Outlet "full mode" second line: env direction (coloured) or schedule (muted). */
    .tile-qta {
      position: absolute; right: 9px; bottom: 8px; text-align: right;
      line-height: 1.12; pointer-events: none;
    }
    .tile-qta div { font-size: 10px; font-weight: 700; letter-spacing: .03em; }
    .tile-qta .l1 { font-weight: 600; }
    .tile-sub2 {
      font-size: 11px; font-weight: 500; margin-top: 1px;
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .tile-sub2.od-heat { color: #ff7a4a; }
    .tile-sub2.od-cool { color: #45b6ff; }
    .tile-sub2.od-hum { color: #3ec7c2; }
    .tile-sub2.od-dehum { color: #e0a52e; }
    .tile-sub2.od-aer { color: #5bbf6a; }
    .tile-sub2.od-exh { color: #a99bff; }
    .tile-sub2.od-day { color: #f2b632; }
    .tile-sub2.od-night { color: #7b8cff; }
    .tile-sub2.od-sched { color: var(--secondary-text-color); font-weight: 400; }
    /* Mode summary block right under the tile's expand arrow: 2-3 short,
       centred lines kept light so the tile stays readable. min-height reserves
       two lines so single-line (Manual) tiles match scheduled two-line tiles and
       device tiles stay a uniform height across panels. */
    .tile-summary {
      display: flex; flex-direction: column; align-items: center;
      justify-content: center; gap: 0;
      margin: 1px 0 2px; width: 100%; min-height: 26px;
    }
    .tile-summary span {
      display: block; max-width: 100%;
      font-size: 10px; line-height: 1.3; color: var(--secondary-text-color);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .tile-summary span:first-child { font-weight: 500; }
    .unit { font-size: 11px; color: var(--secondary-text-color); margin-left: 2px; }
    .tile-target { font-size: 10px; color: var(--secondary-text-color); margin-top: 3px; }
    .tile.clickable { cursor: pointer; }
    .tile.clickable:hover { box-shadow: inset 0 0 0 1px var(--divider-color, #555); }
    .tile-more { --mdc-icon-size: 14px; opacity: 0.55; margin: 0; }
    .soil-pop {
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 10px 12px; margin-top: 8px;
    }
    .soil-pop-head {
      display: flex; align-items: center; justify-content: space-between;
      font-size: 12px; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px;
    }
    .soil-pop-head ha-icon { cursor: pointer; --mdc-icon-size: 18px; }
    /* The soil per-probe breakdown header reads in title case ("Soil Temp · By
       Probe") to match the multi-line graph header; device/outlet pops keep the
       shared uppercase style. (v0.21.74) */
    .soil-pop-head.sph-tc { text-transform: none; letter-spacing: normal; }
    .soil-pop-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 6px 0; font-size: 14px;
      border-top: 0.5px solid var(--divider-color, #333);
    }
    .soil-pop-row:first-of-type { border-top: none; }
    .spn { color: var(--primary-text-color); }
    .spv { font-weight: 500; }
    /* Offline probe row (v0.17.8): red backing + red text, both breakdowns. */
    .soil-pop-row.offline, .soil-all-row.offline {
      background: rgba(255, 107, 107, 0.16); border-radius: 8px;
    }
    .soil-pop-row.offline .spn, .soil-pop-row.offline .spv,
    .soil-all-row.offline .sa-name, .soil-all-row.offline .sa-v {
      color: #ff6b6b;
    }
    /* Expanded device-tile controls */
    .dev-row {
      display: flex; align-items: center; gap: 10px; padding: 8px 0;
      border-top: 0.5px solid var(--divider-color, #333);
    }
    .dev-row:first-of-type { border-top: none; }
    .dev-lbl { font-size: 13px; color: var(--secondary-text-color); }
    .dev-spacer { flex: 1; }
    .dev-row .sl-live { flex: 1; }
    .dev-val {
      font-size: 13px; font-weight: 500; min-width: 34px; text-align: right;
    }
    .dev-row .ctl-input { margin-left: auto; flex: 0 0 auto; min-width: 0; }
    .dev-row .ctl-input select { max-width: 150px; }
    /* A row with an uncommitted (staged) edit gets a subtle left accent bar. */
    .dev-row.staged { position: relative; }
    .dev-row.staged::before {
      content: ""; position: absolute; left: -8px; top: 6px; bottom: 6px;
      width: 2px; border-radius: 2px; background: var(--sf-accent, #ff9800);
    }
    /* Save/Discard bar at the bottom of a schedule/cycle/env tile. */
    .save-bar {
      display: flex; justify-content: flex-end; gap: 8px;
      padding: 10px 0 2px; border-top: 0.5px solid var(--divider-color, #333);
    }
    /* Tab-level Apply bar (Environment / Calibration / Outlets / Settings). */
    .apply-bar { margin-top: 14px; }
    /* A staged (uncommitted) .ctl edit gets a subtle left accent bar. */
    .ctl.staged { position: relative; }
    .ctl.staged::before {
      content: ""; position: absolute; left: -8px; top: 6px; bottom: 6px;
      width: 2px; border-radius: 2px; background: var(--sf-accent, #ff9800);
    }
    .save-bar button {
      font: inherit; font-size: 13px; font-weight: 600; cursor: pointer;
      border-radius: 8px; padding: 6px 16px; border: none;
    }
    .save-btn { color: #fff; }
    .save-btn[disabled] {
      background: var(--divider-color, #444) !important; color: var(--secondary-text-color);
      cursor: default;
    }
    .discard-btn {
      background: transparent; color: var(--secondary-text-color);
      border: 1px solid var(--divider-color, #444) !important;
    }
    .discard-btn[disabled] { opacity: 0.5; cursor: default; }
    .period-times {
      margin-left: auto; display: flex; align-items: center; gap: 6px;
      min-width: 0; flex-wrap: wrap;
    }
    .period-times .dash { color: var(--secondary-text-color); flex: 0 0 auto; }
    /* Stack the period under its label on narrow (mobile) widths so the two
       time inputs share the full row instead of clipping. */
    .period-row { flex-direction: column; align-items: stretch; gap: 6px; }
    .period-row .period-times { margin-left: 0; }
    /* Keep each time field wide enough for the native HH:MM (+AM/PM) control:
       flex-basis floors the width and the row wraps rather than clipping. */
    .period-times input[type="time"] {
      flex: 1 1 110px; min-width: 104px; box-sizing: border-box;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #ccc); border-radius: 8px;
      padding: 6px 8px; font-size: 14px;
    }
    .soil-pop .ctl { padding: 8px 0; border-top: 0.5px solid var(--divider-color, #333); }
    .soil-all-head {
      display: flex; align-items: center; justify-content: space-between;
      cursor: pointer; user-select: none;
    }
    .soil-all-head ha-icon { --mdc-icon-size: 18px; }
    .soil-all {
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 6px 12px; margin-top: 2px;
    }
    .soil-all-row {
      display: grid; grid-template-columns: 1.4fr 1fr 1fr 1fr; gap: 6px;
      align-items: center; padding: 6px 0; font-size: 13px;
      border-top: 0.5px solid var(--divider-color, #333);
    }
    .soil-all-row:first-of-type { border-top: none; }
    .soil-all-hd {
      font-size: 11px; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.03em;
    }
    .sa-name {
      color: var(--primary-text-color);
      overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    }
    .sa-v { text-align: right; font-weight: 500; }
    .soil-all-hd .sa-v, .soil-all-hd .sa-name { font-weight: 400; }
    .controls { display: flex; flex-direction: column; gap: 8px; }
    .row {
      display: flex; align-items: center; gap: 10px;
      background: var(--secondary-background-color); border-radius: 12px; padding: 12px;
    }
    .row ha-icon { --mdc-icon-size: 22px; }
    .row-body { flex: 1; }
    .row-label { font-size: 14px; margin-bottom: 4px; }
    .row input[type="range"] { width: 100%; }
    .row-val { font-size: 13px; font-weight: 500; min-width: 34px; text-align: right; }

    /* Environment / Planting Plan segmented toggle (v3.19.149). */
    .env-seg-row {
      display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 12px;
    }
    .env-seg {
      background: var(--secondary-background-color); color: var(--secondary-text-color);
      border: 1px solid var(--divider-color, #444); border-radius: 10px;
      padding: 9px 0; font-size: 14px; font-weight: 500; cursor: pointer;
    }
    .env-seg.active { font-weight: 600; }
    .plan-banner {
      display: flex; align-items: center; gap: 12px;
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 12px 14px; margin-bottom: 12px;
    }
    .plan-banner ha-icon { --mdc-icon-size: 26px; }
    .plan-banner-title { font-size: 14px; font-weight: 500; }
    .plan-banner-sub { font-size: 12px; color: var(--secondary-text-color); margin-top: 2px; }
    .plan-pct { font-size: 22px; font-weight: 600; }
    .plan-bar {
      height: 6px; border-radius: 4px; overflow: hidden; margin-bottom: 12px;
      background: var(--card-background-color, rgba(0, 0, 0, 0.25));
    }
    .plan-bar-fill { height: 100%; border-radius: 4px; }
    .plan-stage.current { border: 1px solid; }
    .plan-stage-badge {
      margin-left: auto; font-size: 11px; font-weight: 500;
      border: 1px solid; border-radius: 6px; padding: 1px 7px;
    }
    .plan-actions { margin-top: 12px; }
    .plan-btn {
      width: 100%; padding: 11px 0; font-size: 14px; font-weight: 500;
      border-radius: 10px; cursor: pointer;
      border: 1px solid var(--divider-color, #444);
      background: var(--secondary-background-color); color: var(--primary-text-color);
    }
    .plan-btn.stop { color: var(--error-color, #e24b4a); border-color: var(--error-color, #e24b4a); }
    .plan-editbtn {
      display: inline-flex; align-items: center; gap: 4px; flex: 0 0 auto;
      background: transparent; border: 1px solid var(--divider-color, #444);
      color: var(--secondary-text-color); border-radius: 8px; padding: 5px 10px;
      font-size: 12px; cursor: pointer;
    }
    .plan-editbtn ha-icon { --mdc-icon-size: 15px; }
    .pe-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .pe-name {
      flex: 1; font-size: 14px; font-weight: 500; padding: 6px 8px;
      background: var(--card-background-color, rgba(0,0,0,0.2));
      border: 1px solid var(--divider-color, #444); border-radius: 6px;
      color: var(--primary-text-color);
    }
    .pe-del { --mdc-icon-size: 20px; color: var(--error-color, #e24b4a); cursor: pointer; flex: 0 0 auto; }
    .pe-delrow { gap: 8px; }
    .pe-delq { flex: 1; min-width: 0; font-size: 13px; font-weight: 500; }
    .pe-delrow button { flex: 0 0 auto; font-size: 12px; padding: 6px 12px; border-radius: 6px; cursor: pointer; border: 1px solid var(--divider-color, #444); background: transparent; }
    .pe-del-yes { color: #fff; background: var(--error-color, #e24b4a) !important; border-color: var(--error-color, #e24b4a) !important; }
    .pe-del-no { color: var(--secondary-text-color); }
    .pe-dates { display: flex; gap: 6px; margin-bottom: 8px; }
    .pe-dates label { flex: 1; min-width: 0; font-size: 12px; color: var(--secondary-text-color); display: flex; flex-direction: column; gap: 3px; }
    .pe-dates .pe-in { width: 100%; box-sizing: border-box; height: 32px; padding: 4px 6px; font-size: 12px; }
    /* Alarm reminder on its own centred row beneath Start/End. */
    .pe-alarmrow { display: flex; justify-content: center; margin-bottom: 8px; }
    .pe-alarmrow label { font-size: 12px; color: var(--secondary-text-color); display: flex; flex-direction: column; gap: 3px; align-items: center; }
    .pe-alarmrow .pe-in { width: auto; box-sizing: border-box; height: 32px; padding: 4px 6px; font-size: 12px; }
    .pe-timesrow { display: flex; justify-content: center; align-items: flex-end; gap: 8px; margin-bottom: 4px; }
    .pe-timesrow label { font-size: 12px; color: var(--secondary-text-color); display: flex; flex-direction: column; gap: 3px; }
    .pe-timesrow input { width: 100px; box-sizing: border-box; height: 32px; padding: 4px 6px; font-size: 12px; color: var(--primary-text-color); background: var(--card-background-color, rgba(0,0,0,0.2)); border: 1px solid var(--divider-color, #444); border-radius: 6px; }
    /* Light Duration on its own centred row beneath On/Off. */
    .pe-durrow { text-align: center; font-size: 12px; color: var(--secondary-text-color); margin: 0 0 6px; }
    .pe-cellrow { display: flex; gap: 6px; margin-bottom: 6px; }
    .pe-cell { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 3px; font-size: 12px; color: var(--secondary-text-color); }
    .pe-cell .pe-sel { width: 100%; box-sizing: border-box; padding: 6px 4px; }
    .pe-in {
      padding: 6px 8px; font-size: 13px; color: var(--primary-text-color);
      background: var(--card-background-color, rgba(0,0,0,0.2));
      border: 1px solid var(--divider-color, #444); border-radius: 6px; width: 100%;
    }
    .pe-grid-head, .pe-row { display: grid; grid-template-columns: 84px 1fr; align-items: center; gap: 8px; }
    .pe-grid-head { margin: 4px 0; font-size: 11px; color: var(--secondary-text-color); text-align: center; }
    .pe-row { margin-bottom: 6px; }
    .pe-lbl { font-size: 13px; color: var(--secondary-text-color); }
    .pe-cells { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 6px; }
    .pe-cells1 { display: grid; grid-template-columns: 1fr; gap: 6px; }
    .pe-cells2 { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
    .pe-light { border-top: 1px solid var(--divider-color, #444); margin-top: 10px; padding-top: 8px; }
    .pe-light-head { display: flex; align-items: center; justify-content: space-between; font-size: 13px; font-weight: 500; margin-bottom: 8px; }
    .pe-modes { display: inline-flex; gap: 6px; }
    .pe-modebtn {
      background: transparent; border: 1px solid var(--divider-color, #444);
      color: var(--secondary-text-color); border-radius: 6px; padding: 3px 8px;
      font-size: 12px; cursor: pointer;
    }
    .pe-modebtn.on { font-weight: 600; }
    .plan-stage-edit { --mdc-icon-size: 18px; color: var(--secondary-text-color); cursor: pointer; margin-left: auto; flex: 0 0 auto; }
    .pe-back { --mdc-icon-size: 22px; color: var(--secondary-text-color); cursor: pointer; flex: 0 0 auto; }
    .pe-info { font-size: 12px; color: var(--secondary-text-color); margin: 2px 0 6px; }
    .pe-sel {
      width: 100%; padding: 6px 8px; font-size: 13px; border-radius: 6px;
      background: var(--card-background-color, rgba(0,0,0,0.2));
      border: 1px solid var(--divider-color, #444); color: var(--primary-text-color);
    }
    .plan-stage {
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 10px 12px; margin-bottom: 8px;
    }
    .plan-stage-head { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
    .plan-stage-dot { width: 10px; height: 10px; border-radius: 50%; }
    .plan-stage-name { font-size: 14px; font-weight: 500; }
    .plan-stage-dates { font-size: 12px; color: var(--secondary-text-color); margin: 0 0 8px 18px; }
    .plan-stage-grid { display: flex; flex-direction: column; gap: 6px; }
    .plan-metric { display: flex; align-items: center; justify-content: space-between; }
    .plan-metric-label { font-size: 13px; color: var(--secondary-text-color); }
    .plan-metric-vals { display: flex; gap: 8px; }
    .plan-metric-vals > span {
      font-size: 13px; font-weight: 500;
      background: var(--card-background-color, rgba(0, 0, 0, 0.2));
      border: 1px solid var(--divider-color, #444); border-radius: 8px;
      padding: 4px 10px; min-width: 52px; text-align: center;
    }
    .plan-note {
      display: flex; gap: 8px; align-items: flex-start;
      font-size: 12px; color: var(--secondary-text-color);
      background: var(--card-background-color, rgba(0, 0, 0, 0.15));
      border-radius: 10px; padding: 10px 12px; margin-top: 10px; line-height: 1.45;
    }
    .plan-note ha-icon { --mdc-icon-size: 18px; flex: 0 0 auto; margin-top: 1px; }
    .plan-empty {
      text-align: center; padding: 28px 16px; color: var(--secondary-text-color);
    }
    .plan-empty ha-icon { --mdc-icon-size: 40px; opacity: 0.6; }
    .plan-empty-title { font-size: 15px; font-weight: 500; margin: 8px 0 4px; color: var(--primary-text-color); }
    .plan-empty-sub { font-size: 13px; line-height: 1.45; max-width: 320px; margin: 0 auto; }
    .env-cycle { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 8px; }
    .env-row {
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 10px 12px; margin-bottom: 8px;
    }
    .env-row-head {
      display: flex; align-items: center; gap: 8px;
      font-size: 14px; font-weight: 500; margin-bottom: 8px;
    }
    .env-row-head ha-icon { --mdc-icon-size: 20px; }
    /* Night / Day size to their box on the left; a flexible spacer pushes the
       Dead Zone control to the right edge, where it keeps a compact fixed width
       instead of stretching across the whole row. */
    .env-grid {
      display: grid; grid-template-columns: auto auto 1fr auto;
      gap: 8px; align-items: start;
    }
    .env-spacer { min-width: 0; }
    .env-grid > .ctl:last-child { width: 104px; }
    .leaf-tgt-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .vpd-grid { display: flex; flex-direction: column; gap: 8px; }
    .vpd-line { display: flex; align-items: center; justify-content: space-between; }
    .vpd-lbl { font-size: 13px; color: var(--secondary-text-color); }
    .vpd-val {
      font-size: 14px; font-weight: 500; color: var(--secondary-text-color);
      background: var(--card-background-color, rgba(0, 0, 0, 0.2));
      border: 1px solid var(--divider-color, #444); border-radius: 8px;
      padding: 6px 14px; min-width: 96px; text-align: center;
    }
    .outlet {
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 10px 12px; margin-bottom: 8px;
    }
    .outlet-head {
      display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;
    }
    .outlet-name { font-size: 14px; font-weight: 500; }
    .outlet-body { display: flex; flex-direction: column; gap: 8px; }
    .ts-editor { display: flex; flex-direction: column; gap: 8px; margin-top: 2px; }
    .ts-editor .period {
      background: var(--card-background-color, rgba(0, 0, 0, 0.2));
      border-radius: 10px; padding: 8px 10px;
    }
    .ts-editor .period-head {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 6px;
    }
    .ts-editor .period-name { font-size: 13px; font-weight: 500; }
    .ts-editor .del {
      background: none; border: none; color: var(--secondary-text-color);
      font-size: 15px; cursor: pointer; line-height: 1; padding: 2px 4px;
    }
    .ts-editor .days {
      display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px; margin-bottom: 8px;
    }
    .ts-editor .day {
      aspect-ratio: 1; min-width: 0; box-sizing: border-box; border-radius: 50%;
      border: 1px solid var(--divider-color, #555); background: none;
      color: var(--secondary-text-color); font-size: 12px; font-weight: 500;
      cursor: pointer; padding: 0;
    }
    .ts-editor .day.on { color: #fff; }
    .ts-editor .sched-times { display: flex; align-items: flex-end; gap: 8px; }
    .ts-editor .tf { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .ts-editor .tf-lbl { font-size: 11px; color: var(--secondary-text-color); }
    .ts-editor .dash { color: var(--secondary-text-color); padding-bottom: 8px; }
    .ts-editor .tf input[type="time"] {
      width: 100%; box-sizing: border-box; font-size: 14px;
      background: var(--card-background-color, #fff); color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #ccc); border-radius: 8px; padding: 6px 8px;
    }
    .ts-editor .sched-actions { display: flex; gap: 8px; }
    .ts-editor .add {
      flex: 1; background: none; border: 1px dashed var(--divider-color, #555);
      border-radius: 8px; color: var(--secondary-text-color); font-size: 13px;
      padding: 7px; cursor: pointer;
    }

    .alert-note { font-size: 13px; color: var(--secondary-text-color); margin: 4px 2px 0; }
    .set-note { font-size: 13px; color: var(--secondary-text-color); margin: 4px 2px 12px; line-height: 1.5; }
    .cd-pill { margin-top: 4px; width: 100%; display: flex; flex-direction: column; align-items: center; gap: 3px; }
    .cd-txt { font-size: 11px; font-weight: 500; display: inline-flex; align-items: center; gap: 3px; font-variant-numeric: tabular-nums; }
    .cd-bar { width: 72%; height: 3px; border-radius: 999px; background: var(--divider-color, rgba(127,127,127,.25)); overflow: hidden; }
    .cd-fill { height: 100%; border-radius: 999px; transition: width .5s linear; }
    /* Outlet-tile cooldown: absolute overlay pinned to the middle-right so it
       never changes the tile's height (the tile content is left-aligned, so the
       right half is free). Compact + smaller font to fit. */
    .cd-pill.cd-outlet {
      position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
      width: auto; margin: 0; align-items: flex-end; gap: 2px; max-width: 54%; z-index: 1;
    }
    .cd-pill.cd-outlet .cd-txt { font-size: 9px; gap: 2px; }
    .cd-pill.cd-outlet .cd-txt ha-icon { --mdc-icon-size: 11px; }
    .cd-pill.cd-outlet .cd-bar { width: 56px; }
    /* Device-tile cooldown: device tiles pin icon+value to the bottom, so place
       the pill as a centred overlay in the free middle of the tile (so it doesn't
       cram at the very bottom), matching where outlets show theirs. Compact font. */
    .cd-pill.cd-device {
      /* Nudged a hair below centre so it sits a touch lower in the tile. (v0.21.79) */
      position: absolute; left: 0; right: 0; top: 50%; transform: translateY(calc(-50% + 6px));
      width: auto; margin: 0; gap: 2px; z-index: 1;
    }
    .cd-pill.cd-device .cd-txt { font-size: 9px; gap: 2px; }
    .cd-pill.cd-device .cd-txt ha-icon { --mdc-icon-size: 11px; }
    .cd-pill.cd-device .cd-bar { width: 56px; }
    .set-sec { font-size: 14px; font-weight: 500; margin: 18px 2px 2px; padding-top: 12px; border-top: 1px solid var(--divider-color, #333); }
    /* Collapsible section bar — a distinct tappable row, not a bare label. */
    .set-collapse-h {
      display: flex; align-items: center; justify-content: space-between;
      cursor: pointer; user-select: none;
      margin: 14px 0 8px; padding: 10px 12px;
      background: var(--secondary-background-color);
      border: 1px solid var(--divider-color, #333); border-radius: 8px;
    }
    .set-collapse-h ha-icon { --mdc-icon-size: 20px; color: var(--secondary-text-color); }
    .ta-swatches { display: flex; flex-wrap: wrap; gap: 8px; margin: 2px 0 4px; }
    .ta-sw {
      min-width: 34px; height: 28px; padding: 0 8px; border-radius: 7px; cursor: pointer;
      border: 1px solid var(--divider-color, #444); background: transparent;
      display: inline-flex; align-items: center; justify-content: center;
    }
    .ta-sw.on { outline: 2px solid var(--primary-color); outline-offset: 1px; }
    .ta-lbl { font-size: 11px; color: var(--secondary-text-color); }
    .ta-preview {
      margin: 12px auto 4px; width: 120px; min-height: 76px; padding: 10px;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 4px;
      box-sizing: border-box;
    }
    .ta-preview span { font-size: 12px; } .ta-preview b { font-size: 20px; font-weight: 500; }
    .param-graph .pg-range {
      font: inherit; font-size: 11px; padding: 2px 6px; border-radius: 6px;
      background: transparent; color: var(--secondary-text-color);
      border: 1px solid var(--divider-color, #333); margin-left: 8px;
    }
    .param-graph .pg-at { color: var(--secondary-text-color); font-weight: 400; }
    .seg-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .seg {
      display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 7px;
      background: var(--secondary-background-color); color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #444); border-radius: 10px;
      padding: 8px 6px; font-size: 13px; font-weight: 500; cursor: pointer;
    }
    .seg ha-icon { --mdc-icon-size: 16px; flex: none; }
    .seg.on { border-width: 2px; }
    .toggle-row {
      display: flex; align-items: center; justify-content: space-between;
      background: var(--secondary-background-color); border-radius: 10px;
      padding: 10px 12px; font-size: 14px;
    }
    .toggle-row.staged { box-shadow: inset 2px 0 0 var(--sf-accent, #ff9800); }
    .color-row { display: flex; gap: 10px; margin-top: 10px; }
    .color-field {
      flex: 1; display: flex; align-items: center; justify-content: space-between; gap: 6px;
      background: var(--secondary-background-color); border-radius: 8px;
      padding: 5px 9px; font-size: 12px; color: var(--secondary-text-color);
      cursor: pointer;
    }
    /* Round colour "pinwheel": strip the native swatch chrome to a circle. */
    .pinwheel {
      -webkit-appearance: none; appearance: none;
      width: 20px; height: 20px; padding: 0; cursor: pointer;
      background: none; border: none; border-radius: 50%; flex: none;
    }
    .pinwheel::-webkit-color-swatch-wrapper { padding: 0; }
    .pinwheel::-webkit-color-swatch {
      border: 2px solid var(--divider-color, #555); border-radius: 50%;
    }
    .pinwheel::-moz-color-swatch {
      border: 2px solid var(--divider-color, #555); border-radius: 50%;
    }
    .alert-row {
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 10px 12px; margin-bottom: 8px;
    }
    .alert-row.off { opacity: 0.6; }
    .alert-head {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 8px;
    }
    .alert-name { font-size: 14px; font-weight: 500; }
    .alert-vals { display: flex; gap: 14px; }
    .av { display: flex; flex-direction: column; gap: 4px; }
    .av-lbl { font-size: 11px; color: var(--secondary-text-color); }
    .alert-bool {
      display: flex; align-items: center; justify-content: space-between;
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 12px; margin-bottom: 8px; font-size: 14px;
    }
    .sched-actions { display: flex; align-items: center; gap: 8px; }

    .cali-air {
      display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 8px;
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 10px 12px;
    }
    /* Soil calibration: temp / moisture / ec (+ substrate) share one row. Each
       control is the same width as an Air Calibration column; with only 3 items
       (non-pro probe) they spread evenly across the row instead of clumping. */
    .cali-soil-grid {
      display: flex; gap: 8px; justify-content: space-between;
    }
    .cali-soil-grid > * { flex: 0 1 calc((100% - 24px) / 4); min-width: 0; }
    .cali-sub { margin-top: 8px; }
    .cali-empty {
      font-size: 13px; color: var(--secondary-text-color);
      padding: 16px 4px; line-height: 1.4;
    }

    .ctl { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
    .ctl-label { font-size: 11px; color: var(--secondary-text-color); }
    .ctl-input { display: flex; align-items: center; min-width: 0; }
    .ctl-input input[type="number"],
    .ctl-input input[type="text"],
    .ctl-input input[type="time"],
    .ctl-input select {
      width: 100%; box-sizing: border-box; min-width: 0;
      background: var(--card-background-color, #fff); color: var(--primary-text-color);
      font-size: 13px; border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px; padding: 6px 4px;
    }
    /* Mobile browsers render number spin buttons that eat the box width and
       clip the value (e.g. "62" shows as "6"). Remove them. */
    .ctl-input input[type="number"] { appearance: textfield; -moz-appearance: textfield; }
    .ctl-input input[type="number"]::-webkit-outer-spin-button,
    .ctl-input input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none; margin: 0;
    }
    .num-box { display: flex; align-items: center; gap: 4px; }
    /* Wide enough for a 4-digit CO2 target (e.g. 2000) even on mobile. */
    .num-box input[type="number"] {
      width: 4.2em; flex: 0 0 auto; text-align: center; padding-left: 4px; padding-right: 4px;
    }
    .num-box .unit { flex: 0 0 auto; }
    /* Duration editor: h / min / s spinner boxes (Cycle Run/Off Duration). */
    .dur-input { display: flex; align-items: center; gap: 6px; justify-content: flex-end; }
    .dur-box { display: flex; align-items: baseline; gap: 2px; }
    .dur-box input[type="number"] {
      width: 2.6em; flex: 0 0 auto; text-align: center;
      padding-left: 4px; padding-right: 4px;
      background: var(--card-background-color, #fff); color: var(--primary-text-color);
      font-size: 14px; border: 1px solid var(--divider-color, #ccc);
      border-radius: 8px; padding-top: 6px; padding-bottom: 6px;
      appearance: textfield; -moz-appearance: textfield;
    }
    .dur-box input[type="number"]::-webkit-outer-spin-button,
    .dur-box input[type="number"]::-webkit-inner-spin-button {
      -webkit-appearance: none; margin: 0;
    }
    .dur-unit { flex: 0 0 auto; font-size: 11px; color: var(--secondary-text-color); }
    /* Leaf-VPD calibrator (Settings tab). */
    .leaf-cal { margin-top: 10px; }
    .leaf-cal summary {
      cursor: pointer; font-size: 13px; color: var(--secondary-text-color);
      padding: 4px 2px;
    }
    .leaf-spots {
      display: grid; grid-template-columns: repeat(5, 1fr); gap: 6px; margin: 6px 0;
    }
    .leaf-spots input[type="number"] {
      width: 100%; text-align: center; padding: 6px 2px;
      background: var(--secondary-background-color);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #444); border-radius: 8px;
    }
    .leaf-cal-foot {
      display: flex; align-items: center; justify-content: space-between; gap: 8px;
      font-size: 13px; color: var(--secondary-text-color);
    }
    .leaf-apply {
      border: none; border-radius: 8px; padding: 6px 16px; cursor: pointer;
      background: var(--sf-accent, #ff9800); color: #1a1207; font-weight: 500;
    }
    .leaf-apply[disabled] {
      background: var(--divider-color, #444); color: var(--secondary-text-color);
      cursor: default;
    }
    .slider-wrap { display: flex; align-items: center; gap: 8px; width: 100%; min-width: 0; }
    .slider-wrap input[type="range"] { flex: 1; min-width: 0; }
    /* Calibration: slider on the left, editable box on the right, in sync. */
    .slider-box { display: flex; align-items: center; gap: 10px; width: 100%; }
    .slider-box input[type="range"] { flex: 1 1 auto; min-width: 0; }
    .slider-box .num-box { flex: 0 0 auto; }
    .slider-val { font-size: 13px; font-weight: 500; min-width: 40px; text-align: right; }
    .ctl-val { font-size: 14px; }

    .toggle {
      width: 42px; height: 24px; border-radius: 14px; border: none;
      background: var(--disabled-color, #888); position: relative; cursor: pointer;
      transition: background 0.15s; flex: 0 0 auto;
    }
    .toggle::after {
      content: ""; position: absolute; top: 3px; left: 3px;
      width: 18px; height: 18px; border-radius: 50%; background: #fff; transition: left 0.15s;
    }
    .toggle.on::after { left: 21px; }
    /* Compact toggle sized to sit inline with 12px label text (e.g. the
       Outlets-tab Indicator Light switch). */
    .toggle.sm { width: 26px; height: 14px; border-radius: 8px; }
    .toggle.sm::after { top: 2px; left: 2px; width: 10px; height: 10px; }
    .toggle.sm.on::after { left: 14px; }
  `;
}

export class SpiderFarmerCardEditor extends LitElement {
  @property({ attribute: false }) hass?: Hass;
  @state() private _config: CardConfig = { type: "custom:spider-farmer-card" };

  public setConfig(config: CardConfig): void {
    this._config = { ...config };
  }

  private _emit(next: CardConfig): void {
    this._config = next;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: next },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _panelChanged(ev: Event): void {
    const panel = (ev.target as HTMLSelectElement).value;
    const next = { ...this._config };
    if (panel) next.panel = panel;
    else delete next.panel;
    this._emit(next);
  }

  private _titleChanged(ev: Event): void {
    const title = (ev.target as HTMLInputElement).value.trim();
    const next = { ...this._config };
    if (title) next.title = title;
    else delete next.title;
    this._emit(next);
  }

  private _tabChanged(ev: Event): void {
    const v = (ev.target as HTMLSelectElement).value as CardConfig["default_tab"];
    this._emit({ ...this._config, default_tab: v });
  }

  private _outletToggled(slot: string, ev: Event): void {
    const on = (ev.target as HTMLInputElement).checked;
    const set = new Set(this._config.outlets ?? []);
    if (on) set.add(slot);
    else set.delete(slot);
    const outlets = [...set].sort();
    const next = { ...this._config };
    if (outlets.length) next.outlets = outlets;
    else delete next.outlets;
    this._emit(next);
  }

  protected render() {
    if (!this.hass) return nothing;
    const cur = this._config;
    const dt = cur.default_tab as string | undefined;
    const panels = panelSlots(this.hass);
    const outs = nestedOutletSlots(this.hass, cur.panel);
    // Whether the card will have an Outlets tab. AC/S-Station strips ARE outlet
    // devices, so they always show Outlets (by slot type, not entity presence).
    // CB / display panels (dp) have no own outlets — gate them on actual nested
    // outlet strips.
    const isStrip = /^(ac|st)\d+/.test(cur.panel || "");
    const hasOutlets = isStrip || outs.length > 0;
    // "Outlets Log" is only a valid default when there are outlets AND the
    // Outlets Log tab is enabled (persisted card option on the panel).
    const outletsLogOn = !!(cur.panel && (this.hass.states[`sensor.sf_${cur.panel}_alarm_settings`]
      ?.attributes as any)?.card_options?.outlets_log === "1");
    const vpdOn = !!(cur.panel && (this.hass.states[`sensor.sf_${cur.panel}_alarm_settings`]
      ?.attributes as any)?.card_options?.vpd_graph === "1");
    const deviceLogOn = !!(cur.panel && (this.hass.states[`sensor.sf_${cur.panel}_alarm_settings`]
      ?.attributes as any)?.card_options?.device_log === "1");
    const label = (slot: string): string => {
      const name = slotDeviceName(this.hass, slot);
      return name ? `${slot} — ${name}` : slot;
    };
    return html`
      <div class="form">
        <label class="field">
          <span class="flabel">Panel device</span>
          <select @change=${this._panelChanged}>
            ${panels.length ? nothing : html`<option value="">(no devices found yet)</option>`}
            ${!cur.panel ? html`<option value="" selected>— choose a device —</option>` : nothing}
            ${panels.map(
              (s) => html`<option value=${s} ?selected=${s === cur.panel}>${label(s)}</option>`
            )}
            ${cur.panel && !panels.includes(cur.panel)
              ? html`<option value=${cur.panel} selected>${cur.panel} (not found)</option>`
              : nothing}
          </select>
          <span class="hint">Which display panel this card shows.</span>
        </label>

        <label class="field">
          <span class="flabel">Title</span>
          <input type="text" .value=${cur.title ?? ""} placeholder="Spider Farmer"
            @change=${this._titleChanged} />
        </label>

        <label class="field">
          <span class="flabel">Default tab</span>
          <select @change=${this._tabChanged}>
            <option value="overview" ?selected=${!dt || dt === "overview"}>Overview</option>
            <option value="environment" ?selected=${dt === "environment" || dt === "config"}>Environment</option>
            ${hasOutlets ? html`<option value="outlets" ?selected=${dt === "outlets"}>Outlets</option>` : nothing}
            ${hasOutlets && outletsLogOn ? html`<option value="outlets_log" ?selected=${dt === "outlets_log"}>Outlets Log</option>` : nothing}
            ${deviceLogOn ? html`<option value="device_log" ?selected=${dt === "device_log"}>Device Log</option>` : nothing}
            ${vpdOn ? html`<option value="vpd" ?selected=${dt === "vpd"}>VPD</option>` : nothing}
            <option value="calibration" ?selected=${dt === "calibration" || dt === "cali"}>Calibration</option>
            <option value="alerts" ?selected=${dt === "alerts"}>Alerts</option>
            <option value="log" ?selected=${dt === "log"}>Log</option>
          </select>
        </label>

        ${outs.length
          ? html`
              <div class="field">
                <span class="flabel">Outlet devices (Outlets tab)</span>
                <div class="checks">
                  ${outs.map(
                    (s) => html`
                      <label class="check">
                        <input type="checkbox"
                          .checked=${(cur.outlets ?? []).includes(s)}
                          @change=${(ev: Event) => this._outletToggled(s, ev)} />
                        <span>${label(s)}</span>
                      </label>`
                  )}
                </div>
                <span class="hint">Power strips nested under this panel. Standalone strips are controlled from their own card.</span>
              </div>`
          : nothing}
      </div>`;
  }

  static styles = css`
    .form { display: flex; flex-direction: column; gap: 16px; padding: 8px 4px; }
    .field { display: flex; flex-direction: column; gap: 6px; }
    .flabel { font-size: 13px; font-weight: 500; color: var(--primary-text-color); }
    .hint { font-size: 12px; color: var(--secondary-text-color); }
    select, input[type="text"] {
      width: 100%; box-sizing: border-box; font-size: 14px;
      background: var(--card-background-color, #fff); color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #ccc); border-radius: 8px; padding: 8px 10px;
    }
    .checks { display: flex; flex-direction: column; gap: 8px; }
    .check {
      display: flex; align-items: center; gap: 8px; font-size: 14px;
      color: var(--primary-text-color); cursor: pointer;
    }
    .check input { width: 18px; height: 18px; }
  `;
}

// ── SE-series light card ─────────────────────────────────────────────────
interface LightCardConfig {
  type: string;
  light?: string;   // SE slot, e.g. "se1"
  title?: string;
  accent?: string;
}

const SE_LIGHT_RE = /^sf_(se\d+)_light$/;

function seLightSlots(hass: Hass): string[] {
  const slots = new Set<string>();
  for (const eid of Object.keys(hass.states)) {
    if (!eid.startsWith("light.")) continue;
    const m = objectId(eid).match(SE_LIGHT_RE);
    if (m) slots.add(m[1]);
  }
  return [...slots].sort(
    (a, b) => Number(a.replace(/\D/g, "")) - Number(b.replace(/\D/g, ""))
  );
}

interface SePeriod {
  enabled: number;
  days: number[];      // 0=Sun … 6=Sat
  start: string;       // "HH:MM"
  end: string;
  brightness: number;
  fade: number;        // minutes
}

export class SpiderLightCard extends LitElement {
  @property({ attribute: false }) hass?: Hass;
  @state() private config!: LightCardConfig;
  // Local working copy of the schedule while editing (null = in sync).
  @state() private draft: SePeriod[] | null = null;
  // Staged power / brightness / mode (+ legacy schedule fields keyed by entity
  // id). Committed together with the schedule when Apply is pressed.
  @state() private ctlDraft: Record<string, string> = {};

  public setConfig(config: LightCardConfig): void {
    this.config = config;
  }
  public getCardSize(): number {
    return 7;
  }
  static getStubConfig(hass?: Hass): LightCardConfig {
    const slots = hass ? seLightSlots(hass) : [];
    return {
      type: "custom:spider-light-card",
      ...(slots[0] ? { light: slots[0] } : {}),
    };
  }
  static getConfigElement() { return document.createElement("spider-light-card-editor"); }

  private accent(): string {
    return this.config.accent || ACCENT_DEFAULT;
  }
  private seSlot(): string {
    return (
      this.config.light ||
      (this.hass ? seLightSlots(this.hass)[0] : "") ||
      "se1"
    );
  }
  private get(id: string): HassEntity | undefined {
    return this.hass?.states[id];
  }

  protected shouldUpdate(changed: PropertyValues): boolean {
    return changed.has("config") || changed.has("hass")
      || changed.has("draft") || changed.has("ctlDraft");
  }

  // Staged value for an aspect ("power"/"bri"/"mode") or a legacy entity id.
  private cur(key: string, fallback: string): string {
    return key in this.ctlDraft ? this.ctlDraft[key] : fallback;
  }
  private stageCtl(key: string, val: string): void {
    this.ctlDraft = { ...this.ctlDraft, [key]: val };
  }
  private isDirty(): boolean {
    return Object.keys(this.ctlDraft).length > 0 || this.draft !== null;
  }
  // Commit every staged edit — brightness/mode, legacy schedule fields, the
  // multi-period schedule, and power (last, so an explicit off wins) — at once.
  private applyAll(slot: string): void {
    const d = this.ctlDraft;
    const id = `light.sf_${slot}_light`;
    if ("bri" in d) {
      const pct = Number(d.bri);
      if (pct > 0) this.hass?.callService("light", "turn_on",
        { entity_id: id, brightness_pct: pct });
      else this.hass?.callService("light", "turn_off", { entity_id: id });  // dragged to 0
    }
    if ("mode" in d) this.hass?.callService("select", "select_option",
      { entity_id: `select.sf_${slot}_mode`, option: d.mode });
    for (const k of Object.keys(d)) {
      if (!k.includes(".")) continue;   // legacy schedule entities
      if (k.startsWith("number.")) this.hass?.callService("number", "set_value",
        { entity_id: k, value: Number(d[k]) });
      else if (k.startsWith("text.")) this.hass?.callService("text", "set_value",
        { entity_id: k, value: d[k] });
    }
    if ("power" in d) {
      const on = d.power === "on";
      if (!(on && "bri" in d)) this.hass?.callService("light",
        on ? "turn_on" : "turn_off", { entity_id: id });
    }
    if (this.draft) this.saveSchedule(slot);   // clears this.draft
    this.ctlDraft = {};
  }
  private discardAll(): void {
    if (Object.keys(this.ctlDraft).length) this.ctlDraft = {};
    if (this.draft !== null) this.draft = null;
  }

  protected render() {
    if (!this.hass || !this.config) return nothing;
    const slot = this.seSlot();
    const light = this.get(`light.sf_${slot}_light`);
    if (!light) {
      return html`<ha-card>
        <div class="empty">
          No Spider Farmer SE light found${this.config.light
            ? ` for "${this.config.light}"`
            : ""}.
        </div>
      </ha-card>`;
    }
    const liveOn = light.state === "on";
    const liveBri = liveOn
      ? Math.max(0, Math.min(100, Math.round(((light.attributes.brightness ?? 0) / 255) * 100)))
      : 0;
    const modeE = this.get(`select.sf_${slot}_mode`);
    const mode = this.cur("mode", modeE?.state ?? "");
    // "Linked" = the SE light is slaved to a controller (a display panel "cb" or
    // power strip "ac") that drives its output. The device reports this with
    // isForceSlaveMode=1 (mode 2). Detection quirk: the select only accepts its
    // listed options, so the linked value ("Linked", or "Automatic (Standby)" on
    // backends that don't yet relabel it) is REJECTED by the select, which then
    // shows a stale "Automatic". The read-only mode SENSOR always keeps the true
    // value, so detect linked from EITHER. Linked follows the RJ12 cable to a
    // controller (auto, not an app/card setting), so the card is a read-only
    // reflection while linked: the controller owns power/brightness/mode.
    const modeSensor = this.get(`sensor.sf_${slot}_mode`)?.state ?? "";
    const linked = [mode, modeSensor].some(
      (m) => m === "Linked" || m === "Automatic (Standby)"
    );
    const modeOpts = (modeE?.attributes.options as string[] | undefined) ?? ["Manual", "Automatic"];
    // Reflect staged edits on the dial: a staged brightness implies "on".
    const briStaged = "bri" in this.ctlDraft;
    const on = this.cur("power", liveOn ? "on" : "off") === "on";
    const bri = briStaged ? Number(this.ctlDraft.bri) : (on ? liveBri : 0);
    const showOn = briStaged ? bri > 0 : on;
    const devName = slotDeviceName(this.hass, slot);
    const accent = this.accent();
    const f = bri / 100;
    const cx = 100, cy = 100, r = 78;
    const [tx, ty] = polar(cx, cy, r, 135 + f * 270);
    return html`
      <ha-card>
        <div class="header">
          <span class="title">${this.config.title || "Spider Light"}</span>
          ${devName ? html`<span class="device">${devName}</span>` : nothing}
        </div>

        <div class="gauge">
          <svg viewBox="0 0 200 190" aria-hidden="true">
            <path d=${arcPath(cx, cy, r, 0, 1)} class="track" fill="none"
              stroke-linecap="round"></path>
            ${showOn && f > 0
              ? svg`<path d=${arcPath(cx, cy, r, 0, f)} fill="none"
                  stroke-linecap="round" stroke=${accent} stroke-width="15"></path>`
              : nothing}
            ${showOn
              ? svg`<circle cx=${tx.toFixed(2)} cy=${ty.toFixed(2)} r="10"
                  fill="#fff" stroke=${accent} stroke-width="3"></circle>`
              : nothing}
            <text x="100" y="102" text-anchor="middle" class="gval"
              fill=${showOn ? accent : "var(--secondary-text-color)"}>
              ${showOn ? bri + "%" : "Off"}
            </text>
          </svg>
          <button class="power ${on ? "on" : ""} ${linked ? "ro" : ""}"
            style=${on ? `background:${accent}` : ""}
            ?disabled=${linked}
            @click=${linked ? null : () => this.stageCtl("power", on ? "off" : "on")}
            aria-label="Toggle light"></button>
        </div>

        <span class="sl-live bri">
          <input type="range" min="0" max="100" .value=${String(bri)}
            style="accent-color:${accent}" data-unit="%" ?disabled=${linked}
            @input=${sliderBubble}
            @change=${(e: Event) =>
              this.stageCtl("bri", (e.target as HTMLInputElement).value)} />
          <span class="sl-bub"></span>
        </span>

        ${modeE || linked
          ? html`<div class="modes">
              ${modeOpts.map((m: string) => {
                // Active = the Linked option while linked, else the current mode.
                const active = linked ? m === "Linked" : mode === m;
                return html`<button
                  class="mode ${active ? "active" : ""} ${linked ? "ro" : ""}"
                  style=${active ? `color:${accent};border-color:${accent}` : ""}
                  ?disabled=${linked}
                  @click=${linked ? null : () => this.stageCtl("mode", m)}>${m}</button>`;
              })}
              ${linked && !modeOpts.includes("Linked")
                ? html`<button class="mode active ro"
                    style=${`color:${accent};border-color:${accent}`} disabled>Linked</button>`
                : nothing}
            </div>`
          : nothing}

        ${linked
          ? html`<div class="linked-note">Linked — a controller (cb/ac) connected by RJ12 is driving this light.</div>`
          : nothing}

        ${!linked && mode === "Automatic" ? this.renderSchedule(slot) : nothing}
        ${linked
          ? nothing
          : commitBar(accent, this.isDirty(),
              () => this.applyAll(slot), () => this.discardAll(), "apply-bar")}
      </ha-card>`;
  }

  // ── Multi-period, weekday-aware schedule editor ──────────────────────────
  private periodsFor(slot: string): SePeriod[] {
    if (this.draft) return this.draft;
    const a = this.get(`sensor.sf_${slot}_schedule`)?.attributes.periods;
    return Array.isArray(a) ? (a as SePeriod[]) : [];
  }
  // Clone the current periods into the draft, apply an edit, and store it.
  private edit(slot: string, fn: (arr: SePeriod[]) => void) {
    const base = this.draft ?? this.periodsFor(slot);
    const copy: SePeriod[] = JSON.parse(JSON.stringify(base));
    fn(copy);
    this.draft = copy;
  }
  private saveSchedule(slot: string) {
    if (!this.draft) return;
    this.hass?.callService("sf", "set_se_schedule", {
      entity_id: `light.sf_${slot}_light`,
      periods: this.draft,
    });
    this.draft = null;   // re-sync from the device on the next report
  }

  private renderSchedule(slot: string) {
    // New multi-period editor when the schedule sensor is present; otherwise
    // fall back to the legacy single-period entities.
    if (!this.get(`sensor.sf_${slot}_schedule`)) return this.renderScheduleLegacy(slot);
    const periods = this.periodsFor(slot);
    const accent = this.accent();
    return html`
      <div class="section-label">Schedule</div>
      ${periods.map((p, i) => this.renderPeriod(slot, p, i, accent))}
      <div class="sched-actions">
        <button class="add"
          @click=${() =>
            this.edit(slot, (a) =>
              a.push({ enabled: 1, days: [0, 1, 2, 3, 4, 5, 6],
                start: "08:00", end: "20:00", brightness: 50, fade: 0 }))}>
          + Add period
        </button>
      </div>`;
  }

  private renderPeriod(slot: string, p: SePeriod, i: number, accent: string) {
    return html`
      <div class="period">
        <div class="period-head">
          <span class="period-name">Period ${i + 1}</span>
          <button class="del" aria-label="Delete period"
            @click=${() => this.edit(slot, (a) => a.splice(i, 1))}>✕</button>
        </div>
        <div class="days">
          ${DAY_LETTERS.map(
            (d, di) => html`<button
              class="day ${p.days.includes(di) ? "on" : ""}"
              style=${p.days.includes(di) ? `background:${accent};border-color:${accent}` : ""}
              @click=${() =>
                this.edit(slot, (a) => {
                  const arr = a[i].days;
                  const k = arr.indexOf(di);
                  if (k >= 0) arr.splice(k, 1);
                  else arr.push(di);
                  arr.sort((x, y) => x - y);
                })}>${d}</button>`
          )}
        </div>
        <div class="sched-times">
          <div class="tf">
            <span class="tf-lbl">Start</span>
            <input type="time" .value=${p.start}
              @change=${(e: Event) =>
                this.edit(slot, (a) => { a[i].start = (e.target as HTMLInputElement).value; })} />
          </div>
          <span class="dash">—</span>
          <div class="tf">
            <span class="tf-lbl">Stop</span>
            <input type="time" .value=${p.end}
              @change=${(e: Event) =>
                this.edit(slot, (a) => { a[i].end = (e.target as HTMLInputElement).value; })} />
          </div>
        </div>
        <div class="num-row">
          <span class="nr-lbl">Brightness</span>
          <span class="sl-live">
            <input type="range" min="11" max="100" .value=${String(p.brightness)}
              style="accent-color:${accent}" data-unit="%"
              @input=${sliderBubble}
              @change=${(e: Event) =>
                this.edit(slot, (a) => { a[i].brightness = Number((e.target as HTMLInputElement).value); })} />
            <span class="sl-bub"></span>
          </span>
          <span class="nr-val">${p.brightness}%</span>
        </div>
        <div class="num-row">
          <span class="nr-lbl">Sun fade</span>
          <span class="sl-live">
            <input type="range" min="0" max="30" .value=${String(p.fade)}
              style="accent-color:${accent}" data-unit="m"
              @input=${sliderBubble}
              @change=${(e: Event) =>
                this.edit(slot, (a) => { a[i].fade = Number((e.target as HTMLInputElement).value); })} />
            <span class="sl-bub"></span>
          </span>
          <span class="nr-val">${p.fade}m</span>
        </div>
      </div>`;
  }

  private renderScheduleLegacy(slot: string) {
    const start = this.get(`text.sf_${slot}_schedule_start`);
    const stop = this.get(`text.sf_${slot}_schedule_stop`);
    const briN = this.get(`number.sf_${slot}_schedule_brightness`);
    const fade = this.get(`number.sf_${slot}_sunrise_sunset_fade`);
    if (!start && !stop && !briN && !fade) return nothing;
    return html`
      <div class="section-label">Schedule</div>
      ${start || stop
        ? html`<div class="sched-times">
            ${this.timeField(`text.sf_${slot}_schedule_start`, "Start")}
            <span class="dash">—</span>
            ${this.timeField(`text.sf_${slot}_schedule_stop`, "Stop")}
          </div>`
        : nothing}
      ${briN ? this.numRow(`number.sf_${slot}_schedule_brightness`, "Brightness", briN) : nothing}
      ${fade ? this.numRow(`number.sf_${slot}_sunrise_sunset_fade`, "Sunrise / sunset fade", fade) : nothing}`;
  }

  private timeField(id: string, label: string) {
    const e = this.get(id);
    if (!e) return nothing;
    const live = e.state === "unknown" || e.state === "unavailable" ? "" : e.state;
    const v = this.cur(id, live);
    return html`<div class="tf">
      <span class="tf-lbl">${label}</span>
      <input type="time" .value=${v}
        @change=${(ev: Event) =>
          this.stageCtl(id, (ev.target as HTMLInputElement).value)} />
    </div>`;
  }

  private numRow(id: string, label: string, e: HassEntity) {
    const min = e.attributes.min ?? 0;
    const max = e.attributes.max ?? 100;
    const step = e.attributes.step ?? 1;
    const unit = e.attributes.unit_of_measurement ?? "";
    const live = e.state === "unknown" || e.state === "unavailable" ? "" : e.state;
    const v = this.cur(id, live);
    return html`<div class="num-row">
      <span class="nr-lbl">${label}</span>
      <span class="sl-live">
        <input type="range" min=${min} max=${max} step=${step} .value=${String(v)}
          style="accent-color:${this.accent()}" data-unit=${unit}
          @input=${sliderBubble}
          @change=${(ev: Event) =>
            this.stageCtl(id, (ev.target as HTMLInputElement).value)} />
        <span class="sl-bub"></span>
      </span>
      <span class="nr-val">${v}${unit}</span>
    </div>`;
  }

  static styles = css`
    ${SLIDER_BUBBLE_CSS}
    ha-card { padding: 12px 14px 16px; }
    .header {
      display: flex; align-items: baseline; gap: 8px; flex-wrap: wrap;
      margin-bottom: 4px;
    }
    .header .title { font-size: 18px; font-weight: 500; }
    .header .device { font-size: 12px; color: var(--secondary-text-color); }
    .empty { color: var(--secondary-text-color); font-size: 14px; padding: 16px 4px; }
    .gauge { position: relative; width: 100%; max-width: 300px; margin: 0 auto; }
    .gauge svg { width: 100%; height: auto; display: block; }
    .gauge .track { stroke: var(--divider-color, #444); stroke-width: 15; }
    .gauge .gval { font-size: 34px; font-weight: 500; }
    .power {
      position: absolute; left: 50%; bottom: 6%; transform: translateX(-50%);
      width: 54px; height: 28px; border-radius: 16px; border: none; cursor: pointer;
      background: var(--disabled-color, #666); transition: background 0.15s;
    }
    .power::after {
      content: ""; position: absolute; top: 3px; left: 3px;
      width: 22px; height: 22px; border-radius: 50%; background: #fff;
      transition: left 0.15s;
    }
    .power.on::after { left: 29px; }
    .bri { width: 100%; margin: 4px 0 12px; }
    .modes {
      display: flex; gap: 4px; background: var(--secondary-background-color);
      border-radius: 20px; padding: 4px; margin-bottom: 4px;
    }
    .mode {
      flex: 1; background: none; border: 1px solid transparent; border-radius: 16px;
      color: var(--secondary-text-color); font-size: 14px; font-weight: 500;
      padding: 8px 4px; cursor: pointer;
    }
    .mode.active { background: var(--card-background-color, rgba(0,0,0,0.2)); }
    /* Read-only (linked): a controller drives the light, so the card reflects its
       state — dim the controls and show they can't be changed. */
    .mode.ro { cursor: default; }
    .mode.ro:not(.active) { opacity: .4; }
    .power.ro { cursor: default; opacity: .5; }
    input[type="range"]:disabled { opacity: .5; cursor: default; }
    .linked-note {
      font-size: 12px; color: var(--secondary-text-color);
      text-align: center; margin: 2px 2px 6px;
    }
    .section-label {
      font-size: 12px; color: var(--secondary-text-color);
      text-transform: uppercase; letter-spacing: 0.04em; margin: 14px 2px 8px;
    }
    .sched-times { display: flex; align-items: flex-end; gap: 8px; margin-bottom: 10px; }
    .tf { flex: 1; display: flex; flex-direction: column; gap: 4px; }
    .tf-lbl, .nr-lbl { font-size: 11px; color: var(--secondary-text-color); }
    .dash { color: var(--secondary-text-color); padding-bottom: 8px; }
    .tf input[type="time"], .num-row input[type="range"] { width: 100%; box-sizing: border-box; }
    .tf input[type="time"] {
      background: var(--card-background-color, #fff); color: var(--primary-text-color);
      border: 1px solid var(--divider-color, #ccc); border-radius: 8px;
      padding: 6px 8px; font-size: 14px;
    }
    .num-row {
      display: grid; grid-template-columns: auto 1fr auto; gap: 10px;
      align-items: center; padding: 6px 0;
    }
    .nr-val { font-size: 14px; font-weight: 500; min-width: 46px; text-align: right; }
    .period {
      background: var(--secondary-background-color); border-radius: 12px;
      padding: 10px 12px; margin-bottom: 8px;
    }
    .period-head {
      display: flex; align-items: center; justify-content: space-between;
      margin-bottom: 8px;
    }
    .period-name { font-size: 14px; font-weight: 500; }
    .del {
      background: none; border: none; color: var(--secondary-text-color);
      font-size: 16px; cursor: pointer; line-height: 1; padding: 2px 4px;
    }
    .days {
      display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;
      margin-bottom: 10px;
    }
    .day {
      aspect-ratio: 1; min-width: 0; box-sizing: border-box; border-radius: 50%;
      border: 1px solid var(--divider-color, #555); background: none;
      color: var(--secondary-text-color); font-size: 12px; font-weight: 500;
      cursor: pointer; padding: 0;
    }
    .day.on { color: #fff; }
    .sched-actions { display: flex; gap: 8px; margin-top: 4px; }
    .add {
      flex: 1; background: none; border: 1px dashed var(--divider-color, #555);
      border-radius: 8px; color: var(--secondary-text-color); font-size: 14px;
      padding: 8px; cursor: pointer;
    }
    .save-bar {
      display: flex; justify-content: flex-end; gap: 8px;
      padding: 10px 0 2px; border-top: 0.5px solid var(--divider-color, #333);
    }
    .apply-bar { margin-top: 14px; }
    .save-btn, .discard-btn {
      font: inherit; font-size: 13px; font-weight: 600; cursor: pointer;
      border-radius: 8px; padding: 6px 16px; border: none;
    }
    .save-btn { color: #fff; }
    .save-btn[disabled] {
      background: var(--divider-color, #444) !important; color: var(--secondary-text-color);
      cursor: default;
    }
    .discard-btn {
      background: transparent; color: var(--secondary-text-color);
      border: 1px solid var(--divider-color, #444) !important;
    }
    .discard-btn[disabled] { opacity: 0.5; cursor: default; }
  `;
}

// ===========================================================================
// PPFD 3D grow-light card  (custom:ppfd-3d-card)
//
// Ported from the former hand-written vanilla ppfd-3d-card.js into this bundle
// so it shares the spider cards' proven registration, self-heal, and
// persistence pipeline (one build, one served file, one version query). The 3D
// scene uses three.js r128 shipped with the card and served locally (no CDN).
// Persistence
// mirrors the spider card exactly: explicit `panel:` (deterministic fallback),
// a stable key, an instant localStorage cache, and a server-side card_options
// blob adopted once when hass loads. Slider moves no longer rebuild the scene
// synchronously — a dirty flag is drained once per animation frame, which is
// what fixes the "locked up while dragging" freeze.
// ===========================================================================

interface PpfdCardConfig {
  type: string;
  title?: string;
  card_id?: string;
  panel?: string;
  light_model?: string;
  unit_system?: string;
  entities?: { dimmer_percent?: string; height_inches?: string };
  defaults?: {
    height_inches?: number; plant_height_inches?: number; num_plants?: number;
    dimmer_percent?: number; photoperiod_hours?: number;
    auto_brightness?: boolean; brightness_source?: string;
  };
  tent?: { width_ft?: number; length_ft?: number; height_ft?: number };
}

interface PpfdLevel { c: number; a: number; e: number; }
interface PpfdLight {
  name: string; watts: number; isBar: boolean; barCount: number;
  lW: number; lL: number; ppfd: Record<number, PpfdLevel>;
}

// three.js (r128) is shipped WITH the card and served locally — never from a
// public CDN — so the 3D card works offline / on local-only setups and runs no
// third-party code from the internet. It lives next to this bundle: the
// integration serves /sf_bridge_frontend/three.min.js, the dev bundle
// /local/spider-card-dev/three.min.js. Derive the URL from this bundle's own
// <script> src so it's correct in both, with the integration path as a fallback.
function ppfdThreeSrc(): string {
  try {
    const scripts = Array.from(document.querySelectorAll("script[src]")) as HTMLScriptElement[];
    // Prefer THIS bundle's own path: the dev bundle sits beside its own three.min.js
    // in /local/spider-card-dev/; the released prod bundle beside the integration's.
    const self = scripts.find((s) => /spider-farmer-card-dev\.js/.test(s.src))
      || scripts.find((s) => /spider-farmer-card\.js/.test(s.src));
    if (self && self.src) return self.src.replace(/[^/]*$/, "three.min.js");
  } catch { /* fall back to the integration's served path */ }
  return "/sf_bridge_frontend/three.min.js";
}

const PPFD_LIGHTS: Record<string, PpfdLight> = {
  SE4500: {
    name: "SE4500", watts: 320, isBar: true, barCount: 3, lW: 1.163, lL: 0.369,
    ppfd: {
      8: { c: 1800, a: 1350, e: 900 }, 10: { c: 1500, a: 1150, e: 780 }, 12: { c: 1250, a: 960, e: 650 },
      14: { c: 1060, a: 820, e: 545 }, 16: { c: 910, a: 700, e: 465 }, 18: { c: 790, a: 610, e: 400 },
      20: { c: 690, a: 530, e: 350 }, 22: { c: 610, a: 470, e: 305 }, 24: { c: 545, a: 420, e: 270 },
      26: { c: 490, a: 375, e: 240 }, 28: { c: 440, a: 340, e: 215 }, 30: { c: 400, a: 305, e: 195 },
      32: { c: 360, a: 275, e: 175 }, 36: { c: 300, a: 230, e: 145 }, 42: { c: 240, a: 184, e: 115 },
      48: { c: 195, a: 149, e: 93 }, 60: { c: 150, a: 115, e: 72 }, 72: { c: 118, a: 90, e: 56 },
      84: { c: 95, a: 72, e: 45 },
    },
  },
  SF2000: {
    name: "SF2000", watts: 200, isBar: false, barCount: 0, lW: 0.864, lL: 0.432,
    ppfd: {
      8: { c: 1600, a: 1050, e: 480 }, 10: { c: 1320, a: 870, e: 400 }, 12: { c: 1100, a: 720, e: 330 },
      14: { c: 920, a: 600, e: 275 }, 16: { c: 780, a: 505, e: 230 }, 18: { c: 660, a: 430, e: 193 },
      20: { c: 570, a: 370, e: 165 }, 22: { c: 495, a: 320, e: 143 }, 24: { c: 435, a: 280, e: 125 },
      26: { c: 385, a: 248, e: 110 }, 28: { c: 340, a: 218, e: 97 }, 30: { c: 305, a: 196, e: 87 },
      32: { c: 274, a: 176, e: 78 }, 36: { c: 226, a: 145, e: 64 }, 42: { c: 182, a: 116, e: 51 },
      48: { c: 148, a: 95, e: 42 }, 60: { c: 97, a: 62, e: 27 }, 72: { c: 68, a: 43, e: 19 },
      84: { c: 49, a: 31, e: 14 },
    },
  },
  SE5000: {
    name: "SE5000", watts: 480, isBar: true, barCount: 4, lW: 0.855, lL: 0.85,
    ppfd: {
      8: { c: 1561, a: 1101, e: 597 }, 10: { c: 1478, a: 1041, e: 631 }, 12: { c: 1402, a: 986, e: 661 },
      14: { c: 1332, a: 935, e: 686 }, 16: { c: 1267, a: 889, e: 708 }, 18: { c: 1206, a: 845, e: 727 },
      20: { c: 1150, a: 805, e: 744 }, 22: { c: 1098, a: 767, e: 752 }, 24: { c: 1049, a: 732, e: 718 },
      26: { c: 1003, a: 700, e: 686 }, 28: { c: 960, a: 669, e: 656 }, 30: { c: 920, a: 640, e: 628 },
      32: { c: 883, a: 614, e: 601 }, 36: { c: 814, a: 565, e: 554 }, 42: { c: 725, a: 502, e: 492 },
      48: { c: 650, a: 449, e: 440 }, 60: { c: 531, a: 366, e: 358 }, 72: { c: 442, a: 303, e: 297 },
      84: { c: 373, a: 256, e: 251 },
    },
  },
  SF7000: {
    name: "SF7000", watts: 650, isBar: false, barCount: 0, lW: 0.737, lL: 0.558,
    ppfd: {
      8: { c: 2560, a: 1105, e: 314 }, 10: { c: 2298, a: 1052, e: 359 }, 12: { c: 2053, a: 983, e: 394 },
      14: { c: 1881, a: 955, e: 434 }, 16: { c: 1714, a: 912, e: 465 }, 18: { c: 1597, a: 903, e: 506 },
      20: { c: 1441, a: 833, e: 520 }, 22: { c: 1328, a: 798, e: 543 }, 24: { c: 1218, a: 752, e: 556 },
      26: { c: 1138, a: 734, e: 582 }, 28: { c: 1059, a: 704, e: 598 }, 30: { c: 987, a: 677, e: 613 },
      32: { c: 922, a: 651, e: 626 }, 36: { c: 811, a: 603, e: 591 }, 42: { c: 678, a: 541, e: 530 },
      48: { c: 575, a: 488, e: 478 }, 60: { c: 429, a: 403, e: 395 }, 72: { c: 332, a: 332, e: 325 },
      84: { c: 265, a: 265, e: 259 },
    },
  },
  G1000W: {
    name: "G1000W", watts: 1000, isBar: true, barCount: 8, lW: 1.153, lL: 1.122,
    ppfd: {
      8: { c: 2156, a: 1822, e: 1555 }, 10: { c: 2068, a: 1769, e: 1527 }, 12: { c: 1985, a: 1720, e: 1501 },
      14: { c: 1908, a: 1672, e: 1476 }, 16: { c: 1834, a: 1626, e: 1451 }, 18: { c: 1765, a: 1582, e: 1427 },
      20: { c: 1700, a: 1540, e: 1404 }, 22: { c: 1638, a: 1499, e: 1382 }, 24: { c: 1580, a: 1460, e: 1360 },
      26: { c: 1524, a: 1422, e: 1339 }, 28: { c: 1472, a: 1386, e: 1319 }, 30: { c: 1422, a: 1352, e: 1299 },
      32: { c: 1375, a: 1318, e: 1280 }, 36: { c: 1287, a: 1255, e: 1230 }, 42: { c: 1170, a: 1168, e: 1145 },
      48: { c: 1068, a: 1068, e: 1047 }, 60: { c: 901, a: 901, e: 883 }, 72: { c: 770, a: 770, e: 755 },
      84: { c: 666, a: 666, e: 653 },
    },
  },
};

function ppfdAt(light: PpfdLight, hin: number, dim: number):
  { center: number; avg: number; edge: number } {
  const t = light.ppfd;
  const ks = Object.keys(t).map(Number).sort((a, b) => a - b);
  let lo = ks[0], hi = ks[ks.length - 1];
  for (let i = 0; i < ks.length - 1; i++) {
    if (hin >= ks[i] && hin <= ks[i + 1]) { lo = ks[i]; hi = ks[i + 1]; break; }
  }
  if (hin <= ks[0]) lo = hi = ks[0];
  if (hin >= ks[ks.length - 1]) lo = hi = ks[ks.length - 1];
  const f = lo === hi ? 0 : (hin - lo) / (hi - lo);
  const ip = (a: number, b: number) => Math.round((a + (b - a) * f) * dim / 100);
  return { center: ip(t[lo].c, t[hi].c), avg: ip(t[lo].a, t[hi].a), edge: ip(t[lo].e, t[hi].e) };
}

function ppfdColor(v: number, mx: number): [number, number, number] {
  const t = Math.max(0, Math.min(1, v / mx));
  let r: number, g: number, b: number;
  if (t < 0.2) { const s = t / 0.2; r = 0; g = Math.round(s * 80); b = Math.round(160 + s * 95); }
  else if (t < 0.4) { const s = (t - 0.2) / 0.2; r = 0; g = Math.round(80 + s * 175); b = Math.round(255 - s * 255); }
  else if (t < 0.6) { const s = (t - 0.4) / 0.2; r = Math.round(s * 220); g = 255; b = 0; }
  else if (t < 0.8) { const s = (t - 0.6) / 0.2; r = Math.round(220 + s * 35); g = Math.round(255 - s * 120); b = 0; }
  else { const s = (t - 0.8) / 0.2; r = 255; g = Math.round(135 - s * 135); b = 0; }
  return [r, g, b];
}

function ppfdZone(avg: number): { label: string; color: string } {
  if (avg < 200) return { label: "Too dim", color: "#4488dd" };
  if (avg < 400) return { label: "Seedling / early veg", color: "#22bbaa" };
  if (avg < 600) return { label: "Vegetative growth", color: "#44bb44" };
  if (avg < 800) return { label: "Transition / early flower", color: "#bbaa22" };
  if (avg < 1000) return { label: "Peak flower zone", color: "#ee8800" };
  return { label: "High intensity — watch heat", color: "#dd2222" };
}

export class SpiderPpfdCard extends LitElement {
  @property({ attribute: false }) hass?: Hass;
  @state() private config!: PpfdCardConfig;
  @state() private tab: "view" | "set" = "view";
  // Repaint nonce: the 3D viz state lives in plain fields (this.s) so slider
  // drags don't thrash Lit; bumping this forces the reactive chrome (labels,
  // stats, zone) to repaint when we mutate those fields.
  @state() private rev = 0;

  private s = {
    tW: 0.61, tL: 1.22, tH: 1.981, model: "SE4500",
    hin: 18, plantIn: 12, numPlants: 2, dim: 100, photo: 18, metric: false,
  };
  private manualDim = 100;
  private auto = false;
  private brightSrc = "";
  // Photoperiod now lives on the Settings tab (staged like Number of plants). It
  // follows the auto-read light's schedule when that source is a light (see
  // photoFollowsLight); otherwise it's the manual value below.

  // three.js scene handles
  private T: any = null;
  private scene: any = null;
  private camera: any = null;
  private renderer: any = null;
  private raf = 0;
  private o: Record<string, any> = {};
  private cam = { theta: 0.52, phi: 0.36, r: 3.8, drag: false, px: 0, py: 0 };
  private dirty = true;
  private needRender = true;
  private fitDone = false;   // auto-zoom-to-fit runs once per config load

  // persistence
  private serverSynced = false;
  private localApplied = false;
  private saveT: any = null;
  private saved: Record<string, any> | null = null;   // last-persisted snapshot

  public setConfig(config: PpfdCardConfig): void {
    this.config = config;
    const d = config.defaults || {}, tent = config.tent || {};
    this.s.model = config.light_model && PPFD_LIGHTS[config.light_model]
      ? config.light_model : "SE4500";
    this.s.hin = d.height_inches ?? 18;
    this.s.plantIn = d.plant_height_inches ?? 12;
    this.s.numPlants = d.num_plants ?? 2;
    this.s.dim = d.dimmer_percent ?? 100;
    this.manualDim = this.s.dim;
    this.s.photo = d.photoperiod_hours ?? 18;
    this.s.tW = Math.max(0.3, (tent.width_ft ?? 2) * 0.3048);
    this.s.tL = Math.max(0.6, (tent.length_ft ?? 4) * 0.3048);
    this.s.tH = Math.max(0.9, (tent.height_ft ?? 6.5) * 0.3048);
    this.s.metric = this.resolveMetric();
    // Seed the brightness follow/source from the card config as the DEFAULT; a saved
    // per-card setting (Settings tab → server/localStorage) overrides it on load.
    this.auto = !!d.auto_brightness;
    this.brightSrc = d.brightness_source || "";
    // Re-adopt persisted settings for the new config.
    this.serverSynced = false;
    this.localApplied = false;
    this.dirty = true;
    this.fitDone = false;
    this.saved = this.blob();   // nothing staged yet
  }

  public getCardSize(): number { return 11; }

  static getStubConfig(hass?: Hass): PpfdCardConfig {
    let panel: string | undefined;
    if (hass) {
      const ids = Object.keys(hass.states)
        .filter((x) => /^sensor\.sf_[a-z0-9]+_alarm_settings$/.test(x)).sort();
      const m = ids[0] && /^sensor\.sf_([a-z0-9]+)_alarm_settings$/.exec(ids[0]);
      if (m) panel = m[1];
    }
    return {
      type: "custom:ppfd-3d-card", title: "PPFD Visualizer",
      // Unique per card so two PPFD cards never share saved settings (the server key is
      // keyed on card_id). Each new card gets its own; the editor adds one to old cards.
      card_id: "ppfd_" + Math.random().toString(36).slice(2, 8),
      light_model: "SE4500", unit_system: "auto",
      ...(panel ? { panel } : {}),
      defaults: {
        height_inches: 18, plant_height_inches: 12, num_plants: 2,
        dimmer_percent: 100, photoperiod_hours: 18,
      },
      tent: { width_ft: 2, length_ft: 4, height_ft: 6.5 },
    };
  }

  static getConfigElement() { return document.createElement("spider-ppfd-card-editor"); }

  // ── units ────────────────────────────────────────────────────────────────
  private resolveMetric(): boolean {
    const u = (this.config?.unit_system || "auto").toLowerCase();
    if (u === "metric") return true;
    if (u === "imperial") return false;
    const us = (this.hass as any)?.config?.unit_system;
    if (us && us.length) return us.length !== "mi";
    return false;
  }
  private fmtSmall(inches: number): string {
    return this.s.metric ? `${Math.round(inches * 2.54)} cm` : `${Math.round(inches)}"`;
  }
  private fmtTentDim(feet: number): string {
    return this.s.metric ? (feet * 0.3048).toFixed(2) : (+feet).toFixed(1);
  }
  private tentUnit(): string { return this.s.metric ? "m" : "ft"; }

  // ── persistence ────────────────────────────────────────────────────────────
  private optKey(): string {
    const c = this.config || ({} as PpfdCardConfig);
    return "ppfd:" + (c.card_id || c.light_model || "main");
  }
  private panelSlot(): string | null {
    // The storage panel must NOT depend on the selected brightness source:
    // deriving it from brightSrc meant picking a light saved settings to that
    // light's panel, while a fresh load (brightSrc empty) read a different
    // panel — so the selection was never seen again. Use an explicit panel or a
    // deterministic first-sorted alarm panel, independent of any live choice.
    if (this.config?.panel) return this.config.panel;
    if (this.hass) {
      const ids = Object.keys(this.hass.states)
        .filter((x) => /^sensor\.sf_[a-z0-9]+_alarm_settings$/.test(x)).sort();
      if (ids.length) {
        const m = /^sensor\.sf_([a-z0-9]+)_alarm_settings$/.exec(ids[0]);
        if (m) return m[1];
      }
    }
    return null;
  }
  private alarmEntity(): string | null {
    const slot = this.panelSlot();
    if (!slot || !this.hass) return null;
    const id = `sensor.sf_${slot}_alarm_settings`;
    return this.hass.states[id] ? id : null;
  }
  private lsKey(): string { return `ppfd3d:${this.panelSlot() || "nopanel"}:${this.optKey()}`; }
  private blob(): Record<string, any> {
    return {
      model: this.s.model, hin: this.s.hin, plantIn: this.s.plantIn,
      numPlants: this.s.numPlants, photo: this.s.photo, dim: this.manualDim,
      tW: this.s.tW, tL: this.s.tL, tH: this.s.tH,
      auto: !!this.auto, src: this.brightSrc || "",
    };
  }
  private applyBlob(b: any): void {
    if (!b) return;
    if (b.model && PPFD_LIGHTS[b.model]) this.s.model = b.model;
    if (b.hin != null) this.s.hin = b.hin;
    if (b.plantIn != null) this.s.plantIn = b.plantIn;
    if (b.numPlants != null) this.s.numPlants = b.numPlants;
    if (b.photo != null) this.s.photo = b.photo;
    if (b.dim != null) { this.manualDim = b.dim; this.s.dim = b.dim; }
    if (b.tW != null) this.s.tW = b.tW;
    if (b.tL != null) this.s.tL = b.tL;
    if (b.tH != null) this.s.tH = b.tH;
    this.auto = !!b.auto; this.brightSrc = b.src || "";
  }
  private hydrateLocal(): void {
    if (this.localApplied) return;
    this.localApplied = true;
    try {
      const j = localStorage.getItem(this.lsKey());
      if (j) { this.applyBlob(JSON.parse(j)); this.dirty = true; }
    } catch { /* storage blocked */ }
    this.saved = this.blob();
  }
  private adoptServer(): void {
    if (this.serverSynced) return;
    const ae = this.alarmEntity();
    if (!ae) return;   // wait until the panel's alarm sensor exists
    this.serverSynced = true;
    const co = this.hass!.states[ae].attributes.card_options as
      Record<string, string> | undefined;
    const key = this.optKey();
    if (co && co[key] !== undefined) {
      try { this.applyBlob(JSON.parse(co[key])); this.dirty = true; } catch { /* bad JSON */ }
    }
    this.saved = this.blob();   // server is authoritative → nothing staged
  }
  // View-tab fields (model + light/plant height, brightness, photoperiod) save
  // automatically as you drag. Settings-tab fields are staged and only persisted
  // when Apply is pressed — mirroring the Apply/Discard bar on the other cards.
  private static readonly SET_FIELDS = ["auto", "src", "numPlants", "photo", "tW", "tL", "tH"];
  private queueSaveView(): void {
    clearTimeout(this.saveT);
    this.saveT = setTimeout(() => this.saveView(), 700);
  }
  private saveView(): void {
    // Persist the View fields, but keep the (possibly un-applied) Settings fields
    // pinned at their last-saved values so a pending Settings edit isn't written.
    const b = this.blob();
    if (this.saved) for (const k of SpiderPpfdCard.SET_FIELDS) b[k] = this.saved[k];
    this.persistBlob(b);
    this.saved = b;
  }
  private applySettings(): void {
    const b = this.blob();
    this.persistBlob(b);
    this.saved = b;
    this.repaint();
  }
  private discardSettings(): void {
    if (!this.saved) return;
    this.auto = !!this.saved.auto;
    this.brightSrc = this.saved.src || "";
    this.s.numPlants = this.saved.numPlants;
    this.s.photo = this.saved.photo ?? this.s.photo;
    this.s.tW = this.saved.tW; this.s.tL = this.saved.tL; this.s.tH = this.saved.tH;
    if (this.auto) this.readLive(); else this.s.dim = this.manualDim;
    this.dirty = true; this.repaint();
  }
  private settingsDirty(): boolean {
    const s = this.saved;
    if (!s) return false;
    return (!!this.auto) !== (!!s.auto)
      || (this.brightSrc || "") !== (s.src || "")
      || this.s.numPlants !== s.numPlants
      || this.s.photo !== (s.photo ?? this.s.photo)
      || this.s.tW !== s.tW || this.s.tL !== s.tL || this.s.tH !== s.tH;
  }
  private persistBlob(b: Record<string, any>): void {
    const s = JSON.stringify(b);
    const ae = this.alarmEntity();
    if (ae && this.hass?.callService) {
      this.hass.callService("sf", "set_card_option",
        { entity_id: ae, key: this.optKey(), value: s });
    }
    // localStorage is only an instant-paint cache; the server copy above is
    // authoritative. HA origins often sit near the storage quota (many cards),
    // so on QuotaExceededError prune our own stale ppfd3d:* keys and retry once.
    // If it still can't write, that's fine — the server value is adopted on load.
    try {
      localStorage.setItem(this.lsKey(), s);
    } catch {
      try {
        const key = this.lsKey();
        for (const k of Object.keys(localStorage)) {
          if (k.startsWith("ppfd3d:") && k !== key) localStorage.removeItem(k);
        }
        localStorage.setItem(key, s);
      } catch { /* storage full/blocked — server copy still holds */ }
    }
  }

  // ── live entity reads (dimmer/height sensors + auto-read brightness) ────────
  private brightnessOf(st: HassEntity | undefined): number {
    if (!st) return 0;
    if (String(st.entity_id).startsWith("light.")) {
      if (st.state !== "on") return 0;
      const b = st.attributes && st.attributes.brightness;
      return b != null ? Math.round(b / 255 * 100) : 100;
    }
    const v = parseFloat(st.state);
    return isNaN(v) ? 0 : Math.max(0, Math.min(100, Math.round(v)));
  }
  private readLive(): boolean {
    if (!this.hass) return false;
    let chg = false;
    const ents = this.config?.entities || {};
    if (ents.dimmer_percent) {
      const st = this.hass.states[ents.dimmer_percent];
      if (st) { const v = parseFloat(st.state); if (!isNaN(v)) { const nd = Math.max(10, Math.min(100, v)); if (nd !== this.s.dim && !this.auto) { this.s.dim = nd; this.manualDim = nd; chg = true; } } }
    }
    if (ents.height_inches) {
      const st = this.hass.states[ents.height_inches];
      if (st) { const v = parseFloat(st.state); if (!isNaN(v)) { const nh = Math.max(8, v); if (nh !== this.s.hin) { this.s.hin = nh; chg = true; } } }
    }
    if (this.auto && this.brightSrc) {
      const p = this.brightnessOf(this.hass.states[this.brightSrc]);
      if (p !== this.s.dim) { this.s.dim = p; chg = true; }
    }
    return chg;
  }

  // ── Lit lifecycle ──────────────────────────────────────────────────────────
  protected willUpdate(changed: PropertyValues): void {
    if (changed.has("config")) { this.hydrateLocal(); }
    if (changed.has("hass") && this.hass) {
      const m = this.resolveMetric();
      if (m !== this.s.metric) { this.s.metric = m; this.dirty = true; }
      this.hydrateLocal();
      this.adoptServer();
      if (this.readLive()) this.dirty = true;
    }
  }
  protected firstUpdated(): void { this.loadThree(); }
  protected updated(): void {
    // Keep light/plant-height sliders within the current tent height.
    if (this.dirty) this.needRender = true;
  }

  private repaint(): void { this.rev++; }

  private tentInches(): number { return Math.round(this.s.tH / 0.0254); }

  // ── input handlers ──────────────────────────────────────────────────────────
  private onModel(e: Event): void {
    this.s.model = (e.target as HTMLSelectElement).value;
    this.dirty = true; this.repaint(); this.queueSaveView();
  }
  private onSlider(field: "hin" | "plantIn" | "numPlants" | "dim" | "photo", e: Event): void {
    const v = Number((e.target as HTMLInputElement).value);
    const ti = this.tentInches();
    if (field === "hin") this.s.hin = Math.min(v, ti);
    else if (field === "plantIn") this.s.plantIn = Math.min(v, ti);
    else if (field === "numPlants") this.s.numPlants = isNaN(v) ? 1 : Math.max(1, Math.min(12, Math.round(v)));
    else if (field === "photo") this.s.photo = isNaN(v) ? 18 : Math.max(1, Math.min(24, Math.round(v)));
    else if (field === "dim") { if (!this.auto) { this.s.dim = v; this.manualDim = v; } }
    this.dirty = true; this.repaint();
    // numPlants + photo live on the Settings tab now → stage them (Apply commits);
    // the rest are View-tab fields that save as you drag.
    if (field !== "numPlants" && field !== "photo") this.queueSaveView();
  }
  // Photoperiod follows the auto-read light when that source is a Spider Farmer
  // light (a schedule-brightness number source has no schedule to read).
  private photoFollowsLight(): boolean {
    return !!this.auto && (this.brightSrc || "").startsWith("light.");
  }
  // On-hours from the chosen auto-read light's schedule (PPFD window preferred,
  // else Time Slot). Null when it can't be resolved.
  private lightPhotoperiod(): number | null {
    if (!this.hass) return null;
    const m = /^light\.sf_(.+)_(light_\d+)$/.exec(this.brightSrc || "");
    if (!m) return null;
    const panel = m[1], slot = m[2];
    const g = (id: string) => { const s = this.hass!.states[id]; return s && s.state !== "unknown" && s.state !== "unavailable" ? s.state : ""; };
    let a = g(`text.sf_${panel}_${slot}_ppfd_start`), b = g(`text.sf_${panel}_${slot}_ppfd_stop`);
    if (!(a && b) || (a === "00:00" && b === "00:00")) { a = g(`text.sf_${panel}_${slot}_schedule_start`); b = g(`text.sf_${panel}_${slot}_schedule_stop`); }
    const pa = /^(\d{1,2}):(\d{2})/.exec(a), pb = /^(\d{1,2}):(\d{2})/.exec(b);
    if (!pa || !pb) return null;
    const mins = ((+pb[1] * 60 + +pb[2]) - (+pa[1] * 60 + +pa[2]) + 1440) % 1440;
    return Math.round(mins / 60);
  }
  // The photoperiod used for DLI + shown in the box: auto-derived from the light
  // when auto-read is on, else the manual value.
  private effectivePhoto(): number {
    if (this.photoFollowsLight()) { const p = this.lightPhotoperiod(); if (p != null) return p; }
    return this.s.photo;
  }
  private onTent(which: "tW" | "tL" | "tH", e: Event): void {
    const raw = Number((e.target as HTMLInputElement).value);
    const mult = this.s.metric ? 1 : 0.3048;   // metres vs feet
    const meters = isNaN(raw) ? this.s[which] : raw * mult;
    if (which === "tW") this.s.tW = Math.max(0.3, meters);
    else if (which === "tL") this.s.tL = Math.max(0.6, meters);
    else this.s.tH = Math.max(0.9, meters);
    // clamp heights that now exceed the tent
    const ti = this.tentInches();
    if (this.s.hin > ti) this.s.hin = ti;
    if (this.s.plantIn > ti) this.s.plantIn = ti;
    this.dirty = true; this.repaint();   // Settings-tab field → staged, no save
  }
  private onAuto(e: Event): void {
    this.auto = (e.target as HTMLInputElement).checked;
    if (this.auto) {
      // Enabling auto-read with nothing chosen picks the first light, so the
      // feature does something immediately and the dropdown shows a real value.
      if (!this.brightSrc) {
        const o = this.brightOptions();
        if (o.length) this.brightSrc = o[0].id;
      }
      this.readLive();
    } else {
      this.s.dim = this.manualDim;
    }
    this.dirty = true; this.repaint();   // Settings-tab field → staged, no save
  }
  private onBrightSrc(e: Event): void {
    this.brightSrc = (e.target as HTMLSelectElement).value;
    if (this.auto) this.readLive();
    this.dirty = true; this.repaint();   // Settings-tab field → staged, no save
  }

  private brightOptions(): { id: string; name: string }[] {
    if (!this.hass) return [];
    const ids = Object.keys(this.hass.states).filter((id) => {
      if (id.startsWith("light.sf_")) return true;
      if (id.startsWith("number.sf_") && /schedule_brightness/i.test(id)) return true;
      return false;
    }).sort();
    return ids.map((id) => ({
      id, name: this.hass!.states[id].attributes.friendly_name || id,
    }));
  }

  // ── three.js ────────────────────────────────────────────────────────────────
  private loadThree(): void {
    if ((window as any).THREE) { this.initThree(); return; }
    const w = window as any;
    if (!w._ppfdCBs) {
      w._ppfdCBs = [];
      const sc = document.createElement("script");
      sc.src = ppfdThreeSrc();
      sc.onload = () => w._ppfdCBs.forEach((cb: () => void) => cb());
      document.head.appendChild(sc);
    }
    w._ppfdCBs.push(() => this.initThree());
  }
  private canvas(): HTMLCanvasElement | null {
    return this.renderRoot.querySelector("#c") as HTMLCanvasElement | null;
  }
  private initThree(): void {
    const T = this.T = (window as any).THREE;
    const canvas = this.canvas();
    if (!T || !canvas) return;
    const W = (canvas.parentElement?.offsetWidth) || 400, H = 340;
    canvas.style.height = H + "px";
    const scene = this.scene = new T.Scene();
    scene.background = new T.Color(0x090c12);
    this.camera = new T.PerspectiveCamera(36, W / H, 0.01, 40);
    const renderer = this.renderer = new T.WebGLRenderer({ canvas, antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    scene.add(new T.AmbientLight(0x334455, 1.1));
    const sun = new T.DirectionalLight(0xffffff, 0.55);
    sun.position.set(2, 5, 3); scene.add(sun);
    this.attachCam(canvas);
    this.dirty = true; this.needRender = true;
    const anim = () => {
      this.raf = requestAnimationFrame(anim);
      if (this.dirty) { this.dirty = false; this.rebuild(); this.needRender = true; }
      if (this.needRender) { this.needRender = false; this.updCam(); renderer.render(scene, this.camera); }
    };
    anim();
  }
  private attachCam(canvas: HTMLCanvasElement): void {
    canvas.addEventListener("mousedown", (e) => { this.cam.drag = true; this.cam.px = e.clientX; this.cam.py = e.clientY; });
    window.addEventListener("mouseup", () => { this.cam.drag = false; });
    window.addEventListener("mousemove", (e) => {
      if (!this.cam.drag) return;
      this.cam.theta -= (e.clientX - this.cam.px) * 0.007;
      this.cam.phi = Math.max(0.05, Math.min(1.3, this.cam.phi - (e.clientY - this.cam.py) * 0.005));
      this.cam.px = e.clientX; this.cam.py = e.clientY; this.needRender = true;
    });
    canvas.addEventListener("wheel", (e) => {
      this.cam.r = Math.max(1.2, Math.min(10, this.cam.r + (e as WheelEvent).deltaY * 0.005));
      this.needRender = true;
    }, { passive: true });
    let ts: { x: number; y: number; t: number; p: number } | null = null;
    canvas.addEventListener("touchstart", (e) => {
      if (e.touches.length === 1) ts = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: this.cam.theta, p: this.cam.phi };
    });
    canvas.addEventListener("touchmove", (e) => {
      if (!ts || e.touches.length !== 1) return;
      this.cam.theta = ts.t - (e.touches[0].clientX - ts.x) * 0.007;
      this.cam.phi = Math.max(0.05, Math.min(1.3, ts.p - (e.touches[0].clientY - ts.y) * 0.005));
      this.needRender = true;
    }, { passive: true });
  }
  private updCam(): void {
    if (!this.camera) return;
    const { theta, phi, r } = this.cam, tH = this.s.tH;
    this.camera.position.set(
      r * Math.cos(phi) * Math.sin(theta), r * Math.sin(phi) + tH * 0.38,
      r * Math.cos(phi) * Math.cos(theta));
    this.camera.lookAt(0, tH * 0.3, 0);
  }
  private rem(k: string): void {
    if (this.o[k] && this.scene) this.scene.remove(this.o[k]);
    this.o[k] = null;
  }
  private sprite(text: string, sz: number): any {
    const T = this.T, c = document.createElement("canvas");
    c.width = 128; c.height = 64;
    const ctx = c.getContext("2d")!;
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = `bold ${sz}px sans-serif`;
    ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(text, 64, 32);
    return new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(c), transparent: true, depthTest: false }));
  }
  private rebuild(): void {
    const T = this.T, scene = this.scene;
    if (!T || !scene) return;
    const { tW, tL, tH, model, hin, plantIn, numPlants, dim } = this.s;
    const light = PPFD_LIGHTS[model] || PPFD_LIGHTS.SE4500;
    const effectiveH = Math.max(1, hin - plantIn);
    const ppfd = ppfdAt(light, effectiveH, dim);
    const pY = plantIn * 0.0254, y = hin * 0.0254;
    const hw = tW / 2, hl = tL / 2;
    // A real fixture's long axis runs along the tent's longer horizontal side.
    // When the tent is wider than it is deep (tW > tL) rotate the light, its
    // cone, and the plant row 90° so everything lines up with the long axis.
    const rot = tW > tL;

    // tent frame
    this.rem("fr");
    const fG = new T.Group();
    const cor = [[hw, 0, hl], [hw, 0, -hl], [-hw, 0, -hl], [-hw, 0, hl], [hw, tH, hl], [hw, tH, -hl], [-hw, tH, -hl], [-hw, tH, hl]];
    const edges = [[0, 1], [1, 2], [2, 3], [3, 0], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6], [3, 7]];
    const lp: number[] = []; edges.forEach(([a, b]) => lp.push(...cor[a], ...cor[b]));
    const fg = new T.BufferGeometry();
    fg.setAttribute("position", new T.Float32BufferAttribute(lp, 3));
    fG.add(new T.LineSegments(fg, new T.LineBasicMaterial({ color: 0x3a5262 })));
    const bx = new T.Mesh(new T.BoxGeometry(tW, tH, tL), new T.MeshStandardMaterial({ color: 0xbbbf9a, side: T.BackSide, transparent: true, opacity: 0.055, roughness: 1 }));
    bx.position.set(0, tH / 2, 0); fG.add(bx); scene.add(fG); this.o["fr"] = fG;

    // heat plane
    this.rem("ht");
    const hG = new T.Group();
    const maxV = Math.max(ppfd.center * 1.05, 700);
    const RX = 30, RZ = 30, verts: number[] = [], cols: number[] = [], idxs: number[] = [];
    // Footprint anisotropy follows the fixture orientation (rot swaps the axes).
    const barW = (rot ? light.lW : light.lL) / tW, barL = (rot ? light.lL : light.lW) / tL;
    const fx = rot ? 1 : 0.7, fz = rot ? 0.7 : 1;
    for (let zi = 0; zi <= RZ; zi++) for (let xi = 0; xi <= RX; xi++) {
      const x = -hw + (xi / RX) * tW, z = -hl + (zi / RZ) * tL;
      const nx = (xi / RX - 0.5) * 2, nz = (zi / RZ - 0.5) * 2;
      let val: number;
      if (light.isBar) {
        const dw = Math.max(0, Math.abs(nx) - barW * 0.5) / (1 - barW * 0.5 + 0.01);
        const dl = Math.max(0, Math.abs(nz) - barL * 0.5) / (1 - barL * 0.5 + 0.01);
        val = ppfd.edge + (ppfd.center - ppfd.edge) * Math.exp(-(dw * dw * 3.8 + dl * dl * 9));
      } else {
        const d = Math.sqrt(nx * nx * fx + nz * nz * fz);
        val = ppfd.edge + (ppfd.center - ppfd.edge) * Math.exp(-d * d * 2.6);
      }
      val = Math.max(0, val); verts.push(x, pY + 0.004, z);
      const [r, g, b] = ppfdColor(val, maxV); cols.push(r / 255, g / 255, b / 255);
    }
    for (let zi = 0; zi < RZ; zi++) for (let xi = 0; xi < RX; xi++) { const a = zi * (RX + 1) + xi; idxs.push(a, a + (RX + 1), a + 1, a + 1, a + (RX + 1), a + (RX + 1) + 1); }
    const hgeo = new T.BufferGeometry();
    hgeo.setAttribute("position", new T.Float32BufferAttribute(verts, 3));
    hgeo.setAttribute("color", new T.Float32BufferAttribute(cols, 3));
    hgeo.setIndex(idxs); hgeo.computeVertexNormals();
    hG.add(new T.Mesh(hgeo, new T.MeshBasicMaterial({ vertexColors: true, side: T.DoubleSide, transparent: true, opacity: 0.90 })));
    ([[0, ppfd.center], [tW * 0.36, ppfd.avg], [-tW * 0.36, ppfd.avg]] as [number, number][]).forEach(([xo, val]) => {
      const sp = this.sprite(Math.round(val) + "", 22); sp.position.set(xo, pY + 0.065, 0); sp.scale.set(0.25, 0.12, 1); hG.add(sp);
    });
    scene.add(hG); this.o["ht"] = hG;

    // light fixture
    this.rem("li");
    const lG = new T.Group();
    const barMat = new T.MeshStandardMaterial({ color: 0x5a6e7d, metalness: 0.55, roughness: 0.45 });
    if (light.isBar) {
      const n = light.barCount;
      for (let i = 0; i < n; i++) {
        const xo = n === 1 ? 0 : -light.lL / 2 + (light.lL / (n - 1)) * i;
        const bar = new T.Mesh(new T.BoxGeometry(0.026, 0.013, light.lW), barMat); bar.position.set(xo, y, 0); lG.add(bar);
        const led = new T.Mesh(new T.BoxGeometry(0.017, 0.004, light.lW * 0.9), new T.MeshBasicMaterial({ color: 0xfff8e0 })); led.position.set(xo, y - 0.006, 0); lG.add(led);
      }
      [-light.lW / 2, light.lW / 2].forEach((z) => {
        const r = new T.Mesh(new T.BoxGeometry(light.lL, 0.01, 0.016), new T.MeshStandardMaterial({ color: 0x3d4f5c, metalness: 0.4 })); r.position.set(0, y, z); lG.add(r);
      });
    } else {
      const panel = new T.Mesh(new T.BoxGeometry(light.lL, 0.02, light.lW), new T.MeshStandardMaterial({ color: 0x4a5d6b, metalness: 0.4, roughness: 0.6 }));
      panel.position.set(0, y, 0); lG.add(panel);
      const ledMat = new T.MeshBasicMaterial({ color: 0xfff8e0 });
      for (let r = 0; r < 4; r++) for (let c = 0; c < 8; c++) {
        const led = new T.Mesh(new T.CircleGeometry(0.013, 8), ledMat); led.rotation.x = -Math.PI / 2;
        led.position.set(-light.lL / 2 + (c + 0.5) * (light.lL / 8), y - 0.009, -light.lW / 2 + (r + 0.5) * (light.lW / 4)); lG.add(led);
      }
    }
    const ropeY = Math.min(tH - 0.02, y + 0.05);
    if (ropeY > y + 0.04) {
      const ropeMat = new T.LineBasicMaterial({ color: 0x888888, transparent: true, opacity: 0.5 });
      [-light.lL / 2 + 0.04, light.lL / 2 - 0.04].forEach((rx) => {
        const rg = new T.BufferGeometry().setFromPoints([new T.Vector3(rx, ropeY, 0), new T.Vector3(rx, y, 0)]);
        lG.add(new T.Line(rg, ropeMat));
      });
    }
    const glow = new T.PointLight(0xffeeaa, 0.8, 2.2); glow.position.set(0, y, 0); lG.add(glow);
    lG.rotation.y = rot ? Math.PI / 2 : 0;
    scene.add(lG); this.o["li"] = lG;

    // light cone
    this.rem("bm");
    if (y > pY + 0.01) {
      const bG = new T.Group();
      const op = Math.min(0.28, 0.07 + ppfd.center / 6000);
      const lmat = new T.LineBasicMaterial({ color: 0xffdd55, transparent: true, opacity: op });
      const hw2 = light.lL * 0.38, hl2 = light.lW * 0.38;
      ([[-hw2, -hl2], [hw2, -hl2], [hw2, hl2], [-hw2, hl2]] as [number, number][]).forEach(([bx2, bz2]) => {
        const ex = Math.sign(bx2) * tW / 2 * 0.88, ez = Math.sign(bz2) * tL / 2 * 0.88;
        const geo = new T.BufferGeometry().setFromPoints([new T.Vector3(bx2, y, bz2), new T.Vector3(ex, pY + 0.005, ez)]);
        bG.add(new T.Line(geo, lmat));
      });
      const vg = new T.BufferGeometry().setFromPoints([new T.Vector3(0, y + 0.005, 0), new T.Vector3(0, pY + 0.005, 0)]);
      bG.add(new T.Line(vg, new T.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 })));
      bG.rotation.y = rot ? Math.PI / 2 : 0;
      scene.add(bG); this.o["bm"] = bG;
    }

    // plants
    this.rem("pl");
    const pG = new T.Group();
    const pH = plantIn * 0.0254, potH = Math.min(0.25, pH * 0.35 + 0.08), potR = 0.075;
    const potMat = new T.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.9 });
    const stemMat = new T.MeshStandardMaterial({ color: 0x3d6b28, roughness: 0.8 });
    const leafMat = new T.MeshStandardMaterial({ color: 0x2e7d1e, roughness: 0.85, side: T.DoubleSide });
    // Row runs along the longer horizontal axis, matching the light orientation.
    const axisLen = rot ? tW : tL;
    const spacing = axisLen / (numPlants + 1);
    for (let i = 0; i < numPlants; i++) {
      const off = -axisLen / 2 + spacing * (i + 1);
      const px = rot ? off : 0, pz = rot ? 0 : off;
      const pot = new T.Mesh(new T.CylinderGeometry(potR * 0.85, potR, potH, 12), potMat);
      pot.position.set(px, potH / 2, pz); pG.add(pot);
      const stemH = Math.max(0.01, pH - potH);
      if (stemH > 0.015) {
        const stem = new T.Mesh(new T.CylinderGeometry(0.011, 0.015, stemH, 8), stemMat);
        stem.position.set(px, potH + stemH / 2, pz); pG.add(stem);
        const lvls = Math.max(1, Math.floor(stemH / 0.09));
        for (let lv = 0; lv < lvls; lv++) {
          const ly = potH + stemH * (0.35 + lv * 0.55 / Math.max(1, lvls - 1));
          const lr = Math.min(0.11, 0.055 + stemH * 0.16);
          for (let a = 0; a < 3; a++) {
            const ang = a * (Math.PI * 2 / 3) + lv * 1.1;
            const leaf = new T.Mesh(new T.SphereGeometry(lr, 6, 4), leafMat);
            leaf.scale.set(1, 0.2, 0.5);
            leaf.position.set(px + Math.cos(ang) * lr * 0.6, ly, pz + Math.sin(ang) * lr * 0.6);
            pG.add(leaf);
          }
        }
      }
    }
    scene.add(pG); this.o["pl"] = pG;

    // height indicator
    this.rem("hl");
    if (y > pY + 0.01) {
      const hG2 = new T.Group();
      const lx = -tW / 2 - 0.07;
      const mat = new T.LineDashedMaterial({ color: 0xffffff, transparent: true, opacity: 0.45, dashSize: 0.04, gapSize: 0.03 });
      const geo = new T.BufferGeometry().setFromPoints([new T.Vector3(lx, y, 0), new T.Vector3(lx, pY, 0)]);
      const dl = new T.Line(geo, mat); dl.computeLineDistances(); hG2.add(dl);
      const sp = this.sprite(this.fmtSmall(hin - plantIn), 28); sp.position.set(lx - 0.11, (y + pY) / 2, 0); sp.scale.set(0.24, 0.12, 1); hG2.add(sp);
      const arrMat = new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
      const au = new T.Mesh(new T.ConeGeometry(0.013, 0.035, 8), arrMat); au.position.set(lx, y - 0.02, 0); hG2.add(au);
      const ad = new T.Mesh(new T.ConeGeometry(0.013, 0.035, 8), arrMat); ad.rotation.z = Math.PI; ad.position.set(lx, pY + 0.02, 0); hG2.add(ad);
      scene.add(hG2); this.o["hl"] = hG2;
    }
    // Default camera: pull back far enough to frame the whole tent. Runs once
    // per config load so a fresh card opens fully in view; respects the user's
    // wheel-zoom afterwards.
    if (!this.fitDone) { this.fitDone = true; this.cam.r = this.fitDistance(); }
    this.updCam();
  }

  private fitDistance(): number {
    return Math.min(10, Math.max(4.2, 2.0 + Math.max(this.s.tW, this.s.tL, this.s.tH) * 1.8));
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this.raf) cancelAnimationFrame(this.raf);
    if (this.renderer) { try { this.renderer.dispose(); } catch { /* ignore */ } }
  }

  static styles = css`
    :host { display: block; }
    * { box-sizing: border-box; }
    #w {
      background: var(--ha-card-background, var(--card-background-color, #fff));
      border-radius: var(--ha-card-border-radius, 12px);
      border: 1px solid var(--divider-color, rgba(0,0,0,.1));
      overflow: hidden;
      font-family: var(--primary-font-family, sans-serif);
    }
    .top { padding: 10px 14px 0; display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .title { font-size: 14px; font-weight: 500; color: var(--primary-text-color); }
    select, input[type=number] {
      background: var(--secondary-background-color, #f0f0f0);
      color: var(--primary-text-color);
      border: 1px solid var(--divider-color, rgba(0,0,0,.15));
      border-radius: 6px; padding: 4px 8px; font-size: 12px; width: 100%;
    }
    input[type=range] { width: 100%; }
    input[type=range]:disabled { opacity: .45; cursor: not-allowed; }
    .vw { background: #090c12; width: 100%; }
    canvas { display: block; width: 100%; cursor: grab; }
    canvas:active { cursor: grabbing; }
    .stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; padding: 8px 12px; }
    .stat { background: var(--secondary-background-color, #f0f0f0); border-radius: 8px; padding: 7px 10px; text-align: center; }
    .sl { font-size: 10px; color: var(--secondary-text-color); margin-bottom: 2px; }
    .sv { font-size: 16px; font-weight: 500; color: var(--primary-text-color); line-height: 1.1; }
    .su { display: block; font-size: 10px; color: var(--secondary-text-color); margin-top: 2px; }
    .leg { display: flex; align-items: center; gap: 6px; padding: 2px 12px 4px; font-size: 11px; color: var(--secondary-text-color); }
    .legbar { flex: 1; height: 7px; border-radius: 4px; background: linear-gradient(to right, #0044ff, #00ccff, #00ff88, #aaff00, #ffcc00, #ff4400); }
    .zone { padding: 2px 12px 6px; font-size: 11px; color: var(--secondary-text-color); }
    .zbadge { display: inline-block; padding: 2px 8px; border-radius: 9px; font-size: 11px; font-weight: 500; margin-right: 6px; }
    .div { height: 1px; background: var(--divider-color, rgba(0,0,0,.1)); }
    .sec { font-size: 10px; font-weight: 500; color: var(--secondary-text-color); text-transform: uppercase; letter-spacing: .05em; padding: 6px 12px 2px; }
    .ctrls { padding: 6px 12px 8px; display: flex; flex-direction: column; gap: 6px; }
    .r4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .r3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .r2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .cg { display: flex; flex-direction: column; gap: 3px; }
    .cl { font-size: 11px; color: var(--secondary-text-color); white-space: nowrap; }
    .cv { font-size: 12px; font-weight: 500; color: var(--primary-text-color); }
    .tabs { display: flex; gap: 4px; padding: 6px 12px 0; border-bottom: 1px solid var(--divider-color, rgba(0,0,0,.1)); }
    .tab { font-size: 12px; padding: 5px 12px; border-radius: 8px 8px 0 0; cursor: pointer; color: var(--secondary-text-color); }
    .tab.on { color: var(--primary-text-color); background: var(--secondary-background-color, #f0f0f0); font-weight: 500; }
    .set { padding: 10px 12px 12px; display: flex; flex-direction: column; gap: 10px; }
    .setrow { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--primary-text-color); cursor: pointer; }
    .hint { font-size: 11px; color: var(--secondary-text-color); line-height: 1.4; }
    .save-bar { display: flex; justify-content: flex-end; gap: 8px; }
    .save-bar.ppfd-apply { padding: 10px 12px 12px; margin-top: 2px; border-top: 0.5px solid var(--divider-color, rgba(0,0,0,.1)); }
    .save-bar button { font: inherit; font-size: 13px; font-weight: 500; cursor: pointer; border-radius: 8px; padding: 6px 16px; border: none; }
    .save-btn { color: #fff; }
    .save-btn[disabled] { background: var(--divider-color, #444) !important; color: var(--secondary-text-color); cursor: default; }
    .discard-btn { background: transparent; color: var(--secondary-text-color); border: 1px solid var(--divider-color, #444) !important; }
    .discard-btn[disabled] { opacity: .5; cursor: default; }
  `;

  protected render() {
    if (!this.config) return nothing;
    const s = this.s;
    const light = PPFD_LIGHTS[s.model] || PPFD_LIGHTS.SE4500;
    const effectiveH = Math.max(1, s.hin - s.plantIn);
    const ppfd = ppfdAt(light, effectiveH, s.dim);
    const photo = this.effectivePhoto();
    const dli = ((ppfd.avg * photo * 3600) / 1e6).toFixed(1);
    const zone = ppfdZone(ppfd.avg);
    const ti = this.tentInches();
    const u = this.tentUnit();
    const title = this.config.title || "PPFD visualizer";
    const opts = this.brightOptions();
    return html`
      <div id="w">
        <div class="top">
          <div class="title">${title}</div>
          <select @change=${this.onModel} style="width:auto">
            <option value="SE4500" ?selected=${s.model === "SE4500"}>SE4500 320W</option>
            <option value="SE5000" ?selected=${s.model === "SE5000"}>SE5000 480W</option>
            <option value="SF2000" ?selected=${s.model === "SF2000"}>SF2000 200W</option>
            <option value="SF7000" ?selected=${s.model === "SF7000"}>SF7000 650W</option>
            <option value="G1000W" ?selected=${s.model === "G1000W"}>G1000W 1000W</option>
          </select>
        </div>
        <div class="tabs">
          <div class="tab ${this.tab === "view" ? "on" : ""}" @click=${() => { this.tab = "view"; this.needRender = true; }}>View</div>
          <div class="tab ${this.tab === "set" ? "on" : ""}" @click=${() => { this.tab = "set"; }}>Settings</div>
        </div>
        <!-- Canvas stays in the DOM across tabs (only hidden) so the WebGL
             context survives the switch — recreating it left the view black. -->
        <div class="vw" style=${this.tab === "view" ? "" : "display:none"}><canvas id="c" height="340"></canvas></div>
        ${this.tab === "view" ? html`
          <div class="stats">
            <div class="stat"><div class="sl">Center PPFD</div><div class="sv">${ppfd.center.toLocaleString()}<span class="su">μmol/m²/s</span></div></div>
            <div class="stat"><div class="sl">Avg canopy</div><div class="sv">${ppfd.avg.toLocaleString()}<span class="su">μmol/m²/s</span></div></div>
            <div class="stat"><div class="sl">Edge PPFD</div><div class="sv">${ppfd.edge.toLocaleString()}<span class="su">μmol/m²/s</span></div></div>
            <div class="stat"><div class="sl">DLI @ ${photo}h</div><div class="sv">${dli}<span class="su">mol/m²/d</span></div></div>
          </div>
          <div class="leg"><span>Low</span><div class="legbar"></div><span>High PPFD</span></div>
          <div class="zone">
            <span class="zbadge" style="background:${zone.color}22;color:${zone.color};border:1px solid ${zone.color}44">${zone.label}</span>
            ${this.fmtSmall(effectiveH)} light-to-canopy · ${s.dim}% brightness · ${photo}h light
          </div>
          <div class="div"></div>
          <div class="sec">Light &amp; plants</div>
          <div class="ctrls">
            <div class="r3">
              <div class="cg"><span class="cl">Light height <span class="cv">${this.fmtSmall(s.hin)}</span></span><input type="range" min="8" max=${ti} step="1" .value=${String(s.hin)} @input=${(e: Event) => this.onSlider("hin", e)}></div>
              <div class="cg"><span class="cl">Plant height <span class="cv">${this.fmtSmall(s.plantIn)}</span></span><input type="range" min="1" max=${ti} step="1" .value=${String(s.plantIn)} @input=${(e: Event) => this.onSlider("plantIn", e)}></div>
              <div class="cg"><span class="cl">Brightness <span class="cv">${s.dim}%</span></span><input type="range" min="10" max="100" step="5" .value=${String(s.dim)} ?disabled=${this.auto && !!this.brightSrc} @input=${(e: Event) => this.onSlider("dim", e)}></div>
            </div>
          </div>
        ` : html`
          <div class="sec">Brightness</div>
          <div class="set">
            <label class="setrow"><input type="checkbox" .checked=${this.auto} @change=${this.onAuto}> Auto-read brightness from a light</label>
            <div class="cg"><span class="cl">Light source</span>
              <select .value=${this.brightSrc} @change=${this.onBrightSrc}>
                <option value="" ?selected=${!this.brightSrc}>— none —</option>
                ${opts.map((o) => html`<option value=${o.id} ?selected=${this.brightSrc === o.id}>${o.name}</option>`)}
              </select>
            </div>
            <div class="hint">
              ${this.auto && this.brightSrc
                ? html`Reading ${(this.hass?.states[this.brightSrc]?.attributes.friendly_name) || this.brightSrc}: ${s.dim}%`
                : "Pick a Spider Farmer light (live brightness) or a Schedule Brightness (target) and the value tracks it live."}
            </div>
          </div>
          <div class="div"></div>
          <div class="sec">Plants &amp; photoperiod</div>
          <div class="ctrls">
            <div class="r3">
              <div class="cg"><span class="cl">Number of plants</span><input type="number" min="1" max="12" step="1" .value=${String(s.numPlants)} @change=${(e: Event) => this.onSlider("numPlants", e)}></div>
              <div class="cg"><span class="cl">Photoperiod (h)</span><input type="number" min="1" max="24" step="1" .value=${String(this.effectivePhoto())} ?disabled=${this.photoFollowsLight()} @change=${(e: Event) => this.onSlider("photo", e)}></div>
            </div>
            ${this.photoFollowsLight()
              ? html`<div class="hint">Auto from the selected light's schedule — ${this.effectivePhoto()}h. Uncheck “Auto-read brightness from a light” to set hours manually.</div>`
              : nothing}
          </div>
          <div class="div"></div>
          <div class="sec">Tent dimensions</div>
          <div class="ctrls">
            <div class="r3">
              <div class="cg"><span class="cl">Width (${u})</span><input type="number" min=${this.s.metric ? "0.3" : "1"} max=${this.s.metric ? "3.0" : "10"} step="0.1" .value=${this.fmtTentDim(s.tW / 0.3048)} @change=${(e: Event) => this.onTent("tW", e)}></div>
              <div class="cg"><span class="cl">Length (${u})</span><input type="number" min=${this.s.metric ? "0.3" : "1"} max=${this.s.metric ? "3.6" : "12"} step="0.1" .value=${this.fmtTentDim(s.tL / 0.3048)} @change=${(e: Event) => this.onTent("tL", e)}></div>
              <div class="cg"><span class="cl">Height (${u})</span><input type="number" min=${this.s.metric ? "0.9" : "3"} max=${this.s.metric ? "3.6" : "12"} step="0.1" .value=${this.fmtTentDim(s.tH / 0.3048)} @change=${(e: Event) => this.onTent("tH", e)}></div>
            </div>
          </div>
          ${commitBar("var(--primary-color, #03a9f4)", this.settingsDirty(),
            () => this.applySettings(), () => this.discardSettings(), "ppfd-apply")}
        `}
      </div>
    `;
  }
}

// ── Time-lapse naming (shared by the card + its editor) ────────────────────
// A card's identity (tl_id) and default folder are "Title_camera_interval", so the
// SAME camera on two cards at different rates (e.g. 5m vs 1d) are separate time-lapses.
const TL_INTERVAL_TAGS: [number, string][] = [
  [300, "5m"], [600, "10m"], [900, "15m"], [1200, "20m"], [1800, "30m"], [3600, "1h"], [86400, "1d"]];
function tlIntervalTag(sec: number): string {
  const m = TL_INTERVAL_TAGS.find(([s]) => s === sec);
  if (m) return m[1];
  if (!sec) return "";
  if (sec % 86400 === 0) return `${sec / 86400}d`;
  if (sec % 3600 === 0) return `${sec / 3600}h`;
  if (sec % 60 === 0) return `${sec / 60}m`;
  return `${sec}s`;
}
// Human, folder-friendly base name — Title keeps its case (spaces→"-"), camera is its
// entity id without the "camera." prefix, interval tag last. e.g. Grow-Bench_grow_bench_profile_000_5m
function tlBaseName(title: string, camera: string, interval: number): string {
  const t = (title || "").trim().replace(/\s+/g, "-");
  const c = (camera || "").replace(/^camera\./, "");
  const tag = tlIntervalTag(Number(interval) || 0);
  return [t, c, tag].filter(Boolean).join("_") || "timelapse";
}
// Strict lowercase slug of the base name — the tl_id (must match the backend's slug).
function tlIdFor(title: string, camera: string, interval: number): string {
  const s = tlBaseName(title, camera, interval).toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return s || "timelapse";
}

// Guarded registration — a second load (or tabbed-card's scoped registry)
// must not throw "already defined".
// ── Time-lapse viewer card (Phase 1) ───────────────────────────────────────
// Plays back frames captured server-side by the integration (secure storage).
// Frames load via short-lived SIGNED URLs fetched over the HA websocket — no
// public path, no embedded token. (card v0.21.88)
export class SpiderTimelapseCard extends LitElement {
  @property({ attribute: false }) hass!: any;
  @state() private config: any = {};
  @state() private _frames: { name: string; stamp: string; url: string }[] = [];
  @state() private _idx = 0;
  @state() private _playing = false;
  @state() private _session: string | null = null;
  @state() private _loading = false;
  @state() private _sizeBytes = 0;
  @state() private _settingsOpen = false;
  @state() private _cfg: any = {};
  @state() private _instances: any[] = [];
  @state() private _rmConfirm: string | null = null;   // tl_id armed for delete (two-tap)
  private _rmTimer: number | null = null;
  private _timer: any = null;
  private _refresh: any = null;
  private _waitTick: any = null;

  static getStubConfig() { return {}; }

  static getConfigElement() { return document.createElement("spider-timelapse-card-editor"); }
  setConfig(config: any) {
    const c = { ...(config || {}) };
    // Resolve a stable instance id = slug(Title_camera_interval) so each card targets
    // its own time-lapse — the SAME camera on two cards at different intervals is two
    // separate time-lapses. Kept on the config for every websocket/service call.
    if (!c.tl_id && c.camera) c.tl_id = tlIdFor(c.title, c.camera, Number(c.interval) || 0);
    this.config = c;
  }
  getCardSize() { return 6; }

  connectedCallback() { super.connectedCallback(); this._startRefresh(); }
  disconnectedCallback() {
    super.disconnectedCallback();
    this._stopPlay();
    if (this._refresh) { clearInterval(this._refresh); this._refresh = null; }
  }

  private _statusEntity() {
    const h = this.hass; if (!h) return null;
    const id = this.config.tl_id;
    if (id) {
      for (const k of Object.keys(h.states)) {
        if (!k.startsWith("sensor.sf_timelapse")) continue;
        const st = h.states[k];
        if (st && st.attributes && st.attributes.tl_id === id) return st;
      }
    }
    // Explicit override, or the legacy single sensor from before multi-instance.
    if (this.config.entity && h.states[this.config.entity]) return h.states[this.config.entity];
    if (!id && h.states["sensor.sf_timelapse"]) return h.states["sensor.sf_timelapse"];
    return null;
  }

  private _startRefresh() {
    if (this._refresh) return;
    this._fetchFrames();
    // Re-fetch periodically: picks up new frames + refreshes expiring signed URLs.
    this._refresh = setInterval(() => this._fetchFrames(), 20000);
  }

  private async _fetchFrames() {
    // Don't refetch while playing: each fetch re-signs every frame URL (new signature),
    // which busts the browser cache and makes playback re-download frames → stutter/hang.
    // Keeping URLs stable during playback lets the browser cache each frame after one load.
    if (!this.hass?.connection || this._loading || this._playing) return;
    this._loading = true;
    try {
      const sess = await this.hass.connection.sendMessagePromise({ type: "sf/timelapse/sessions", tl_id: this.config.tl_id });
      const sessions = (sess && sess.sessions) || [];
      const session = this._session
        || (sessions[0] && sessions[0].session)
        || (sess && sess.status && sess.status.session) || null;
      this._session = session;
      const smatch = sessions.find((s: any) => s.session === session);
      this._sizeBytes = smatch ? (smatch.bytes || 0) : 0;
      if (!session) { this._frames = []; this._loading = false; return; }
      const res = await this.hass.connection.sendMessagePromise({ type: "sf/timelapse/frames", tl_id: this.config.tl_id, session });
      const frames = (res && res.frames) || [];
      const atEnd = this._idx >= this._frames.length - 1;
      this._frames = frames;
      if (atEnd || this._idx >= frames.length) this._idx = Math.max(0, frames.length - 1);
    } catch (_e) { /* transient — try again next tick */ }
    this._loading = false;
  }

  private _play() {
    if (!this._frames.length) return;
    this._playing = true;
    this._preloadAround(this._idx);
    const fps = Number(this.config.fps) || 8;
    this._timer = setInterval(() => {
      this._idx = this._frames.length ? (this._idx + 1) % this._frames.length : 0;
      this._preloadAround(this._idx);
    }, Math.max(40, 1000 / fps));
  }
  private _stopPlay() {
    this._playing = false;
    if (this._timer) { clearInterval(this._timer); this._timer = null; }
    this._fetchFrames();   // resume: pull any frames captured during playback
  }
  // Warm the browser cache for the next few frames so playback doesn't stall waiting
  // for each image to download when its turn comes.
  private _preloadAround(idx: number) {
    const n = this._frames.length; if (!n) return;
    for (let k = 1; k <= 4; k++) {
      const f = this._frames[(idx + k) % n];
      if (f && f.url) { const im = new Image(); (im as any).decoding = "async"; im.src = f.url; }
    }
  }
  private _frameErrAt = 0;
  private _onFrameError() {
    // A signed URL expired (e.g. a very long playback past the 10-min TTL) — pull fresh
    // ones. Debounced so a transient blip doesn't spam the websocket.
    const now = Date.now();
    if (now - this._frameErrAt < 3000) return;
    this._frameErrAt = now;
    const wasPlaying = this._playing;
    this._playing = false;             // allow the refetch through
    this._fetchFrames().then(() => { this._playing = wasPlaying; });
  }
  private _toggle() { this._playing ? this._stopPlay() : this._play(); }

  private _startCapture() {
    const st = this._statusEntity();
    const interval = st ? Number(st.attributes.interval_s) || 300 : 300;
    this.hass.callService("sf", "timelapse_start", { tl_id: this.config.tl_id, interval });
  }
  private _stopCapture() { this.hass.callService("sf", "timelapse_stop", { tl_id: this.config.tl_id }); }
  private _export() {
    if (!this._session) return;
    this.hass.callService("sf", "timelapse_export", {
      tl_id: this.config.tl_id, session: this._session, fps: Number(this.config.fps) || 15,
    });
  }
  private async _download() {
    try {
      const r = await this.hass.connection.sendMessagePromise(
        { type: "sf/timelapse/export_url", tl_id: this.config.tl_id, session: this._session });
      if (r && r.url) window.open(r.url, "_blank");
    } catch (_e) { /* no export yet */ }
  }
  private _clearAll() {
    const st = this._statusEntity();
    const n = st ? (st.attributes.frame_count ?? 0) : 0;
    const label = this.config.title || (st && st.attributes.name) || "this time-lapse";
    if (!window.confirm(`Delete ALL ${n} image(s) and exported videos for ${label}? This cannot be undone.`)) return;
    this.hass.callService("sf", "timelapse_clear", { tl_id: this.config.tl_id });
    this._frames = []; this._idx = 0; this._session = null; this._sizeBytes = 0;
    setTimeout(() => this._fetchFrames(), 1500);
  }

  // Friendly name of a camera entity (falls back to the entity id sans "camera.").
  // Used as the header default + the Display-name placeholder, so a blank custom
  // name shows the camera's friendly name instead of the long tl_id/entity slug.
  private _camFriendly(cam?: string): string {
    const id = cam || this._statusEntity()?.attributes?.camera || this.config.camera || "";
    if (!id) return "";
    const fn = (this.hass?.states[id]?.attributes?.friendly_name as string) || "";
    return fn || String(id).replace(/^camera\./, "");
  }
  // Header title: explicit Lovelace title, else the saved custom label, else the
  // camera's friendly name, else the instance name. Keeps the header uncluttered.
  private _displayName(st: any): string {
    const label = (st?.attributes?.label as string) || "";
    return this.config.title || label || this._camFriendly(st?.attributes?.camera)
      || (st?.attributes?.name as string) || "Time-lapse";
  }

  // ── in-card settings (writes to the backend via sf.timelapse_configure) ────
  private _panelList(): string[] {
    const h = this.hass; if (!h) return [];
    const out = new Set<string>();
    for (const k of Object.keys(h.states)) {
      const m = /^sensor\.sf_([a-z0-9]+)_temperature$/.exec(k);
      if (m) out.add(m[1]);
    }
    return [...out].sort();
  }
  private _openSettings() {
    const a = this._statusEntity()?.attributes || {};
    // NOTE: camera, title (label) and storage_dir are set at card SETUP (the editor),
    // NOT staged here — so they're intentionally absent from _cfg and the ⚙ Apply
    // never touches them.
    this._cfg = {
      interval: Number(a.interval_s) || 300,
      retention: Number(a.retention_days) || 7,
      enabled: !!a.capturing,
      overlay: !!a.overlay,
      overlay_burn: !!a.overlay_burn,
      overlay_panel: a.overlay_panel || (this._panelList()[0] || ""),
      overlay_fields: Array.isArray(a.overlay_fields) ? [...a.overlay_fields]
        : ["temp", "humidity", "vpd", "timestamp"],
      overlay_color: a.overlay_color || "#ffffff",
      overlay_font: Number(a.overlay_font) || 12,
      overlay_grouped: a.overlay_grouped !== false,   // default grouped
      overlay_pos: (a.overlay_pos && typeof a.overlay_pos === "object") ? { ...a.overlay_pos } : {},
      overlay_orient: a.overlay_orient === "h" ? "h" : "v",
      overlay_labels: a.overlay_labels !== false,   // default show labels
      align: a.align !== false,                     // default wait for the mark
      daily_at: a.daily_at || "00:00",
    };
    this._settingsOpen = true;
    this._loadInstances();
  }
  private async _loadInstances() {
    if (!this.hass?.connection) return;
    try {
      const r = await this.hass.connection.sendMessagePromise({ type: "sf/timelapse/list" });
      this._instances = (r && r.instances) || [];
    } catch (_e) { this._instances = []; }
  }
  // Two-tap delete — reliable on every client (window.confirm is suppressed in some
  // HA webviews, which made 🗑 silently do nothing). First tap arms (button turns
  // red "Delete?"), second within 4 s deletes the instance AND its images.
  private _armRemove(tl_id: string) {
    this._rmConfirm = tl_id;
    if (this._rmTimer) clearTimeout(this._rmTimer);
    this._rmTimer = window.setTimeout(() => { this._rmConfirm = null; this._rmTimer = null; }, 4000);
  }
  private _removeInstance(tl_id: string) {
    this._rmConfirm = null;
    if (this._rmTimer) { clearTimeout(this._rmTimer); this._rmTimer = null; }
    // Delete the images first (clear) then drop the instance (remove). Both services
    // exist in every integration version, so this works even if the installed backend
    // predates the remove service's delete_images flag.
    this.hass.callService("sf", "timelapse_clear", { tl_id });
    this.hass.callService("sf", "timelapse_remove", { tl_id });
    this._instances = this._instances.filter((i) => i.tl_id !== tl_id);
    setTimeout(() => this._loadInstances(), 1200);
  }
  // Re-create THIS card's instance from its config (camera set at setup). Lets you
  // set up the same camera again after a delete without re-picking in the editor.
  private _setupFromConfig() {
    const cam = this.config.camera;
    if (!cam) return;
    const data: any = {
      tl_id: this.config.tl_id, camera: cam, label: this.config.title || "",
      interval: Number(this.config.interval) || 300,
    };
    if (this.config.storage_dir) data.storage_dir = this.config.storage_dir;
    if ((Number(this.config.interval) || 300) === 86400 && this.config.daily_at) data.daily_at = this.config.daily_at;
    this.hass.callService("sf", "timelapse_configure", data);
    setTimeout(() => this._fetchFrames(), 1500);
  }
  private _applySettings() {
    // storage_custom is a UI-only flag — strip it so the service schema accepts the call.
    const { storage_custom, ...cfg } = this._cfg || {};
    this.hass.callService("sf", "timelapse_configure", {
      tl_id: this.config.tl_id, name: this.config.name, ...cfg });
    this._settingsOpen = false;
    setTimeout(() => this._fetchFrames(), 1500);
  }
  // Current live env readings from the chosen panel, for the editing preview.
  private _liveReadings(panel: string): any {
    const h = this.hass; const out: any = {};
    if (!h || !panel) return out;
    const map: [string, string][] = [["temp", "temperature"], ["humidity", "humidity"],
      ["vpd", "vpd"], ["co2", "co2"], ["ppfd", "ppfd"]];
    for (const [k, suf] of map) {
      const st = h.states[`sensor.sf_${panel}_${suf}`];
      if (st && ["unknown", "unavailable", ""].indexOf(st.state) < 0) {
        const unit = (st.attributes && st.attributes.unit_of_measurement) || "";
        out[k] = `${st.state}${unit}`;
      }
    }
    return out;
  }
  private _nowStamp(): string {
    const d = new Date(); const p = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`;
  }
  // Grow-day number (1-based, calendar days since the session started). Mirrors the
  // backend's _day_number so the on-card overlay and burned frames agree.
  private _dayNumber(cur: any): number {
    const sess = this._statusEntity()?.attributes?.session;
    const sd = this._ymdDate(sess);
    if (!sd) return 1;
    const m = cur && /^(\d{4})(\d{2})(\d{2})-/.exec(cur.stamp || "");
    const fd = m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date();
    const f0 = new Date(fd.getFullYear(), fd.getMonth(), fd.getDate());
    return Math.floor((f0.getTime() - sd.getTime()) / 86400000) + 1;
  }
  private _ymdDate(s: string): Date | null {
    const m = /^(\d{4})(\d{2})(\d{2})-/.exec(s || "");
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  }
  private _setCfg(patch: any) { this._cfg = { ...this._cfg, ...patch }; }
  private _toggleField(f: string) {
    const cur: string[] = this._cfg.overlay_fields || [];
    this._setCfg({ overlay_fields: cur.includes(f) ? cur.filter((x) => x !== f) : [...cur, f] });
  }
  // The active overlay config: the staged edits while the settings panel is open,
  // otherwise the persisted status (so the overlay reflects what will be saved).
  private _ovActive(): any {
    return this._settingsOpen ? (this._cfg || {}) : (this._statusEntity()?.attributes || {});
  }
  private _overlayOn(st: any): boolean {
    if (this._settingsOpen) return !!(this._cfg && this._cfg.overlay);
    // Only the card draws it when NOT burning (a burned frame already carries it).
    return !!(st.attributes.overlay && !st.attributes.overlay_burn);
  }
  // Positioned overlay items (mirrors the backend's _overlay_items): grouped → one
  // stacked box in selection order; otherwise one box per field at its own anchor.
  private _overlayItems(cur: any): { key: string; text: string; x: number; y: number }[] {
    const src = this._ovActive();
    const fields: string[] = src.overlay_fields || [];
    const editing = this._settingsOpen;
    // While editing, preview LIVE values from the chosen panel so you see real
    // numbers before any frame is captured; otherwise use the frame's own data.
    const livev = editing ? this._liveReadings(src.overlay_panel) : null;
    const data = (livev && Object.keys(livev).length) ? livev : (cur && cur.data);
    const lbl: any = { temp: "Temp", humidity: "RH", vpd: "VPD", co2: "CO2", ppfd: "PPFD" };
    const showLabels = src.overlay_labels !== false;
    const rendered: [string, string][] = [];
    for (const f of fields) {
      if (f === "timestamp") {
        rendered.push(["timestamp", cur ? this._fmt(cur.stamp) : (editing ? this._nowStamp() : "Time —")]);
      } else if (f === "day") {
        rendered.push(["day", `Day ${this._dayNumber(cur)}`]);
      } else {
        // Drop the "/m²/s" from PPFD (the ² renders as a stray glyph in burned frames,
        // and it's just noise on the small overlay) — keep "µmol". Works for old frames too.
        const raw = data && data[f];
        const v = typeof raw === "string" ? raw.replace(/\/m[²2]\/s/g, "") : raw;
        const tag = showLabels ? `${lbl[f] || f} ` : "";
        rendered.push([f, v ? `${tag}${v}` : `${tag}—`]);
      }
    }
    if (!rendered.length) return [];
    const pos = (src.overlay_pos && typeof src.overlay_pos === "object") ? src.overlay_pos : {};
    const xy = (p: any, dx: number, dy: number): [number, number] =>
      (Array.isArray(p) && p.length === 2) ? [Number(p[0]), Number(p[1])] : [dx, dy];
    if (src.overlay_grouped !== false) {
      const [x, y] = xy(pos.group, 2, 70);
      const sep = src.overlay_orient === "h" ? "   " : "\n";
      return [{ key: "group", text: rendered.map((r) => r[1]).join(sep), x, y }];
    }
    return rendered.map((r, i) => { const [x, y] = xy(pos[r[0]], 2, Math.min(4 + i * 12, 88)); return { key: r[0], text: r[1], x, y }; });
  }
  // Drag a reading (or the group box) around on the live image to position it.
  private _drag: string | null = null;
  private _dragGrabX = 0;   // px offset of the cursor from the box's left edge at grab
  private _dragGrabY = 0;   // px offset of the cursor from the box's top edge at grab
  private _dragW = 0;       // box width in px (captured at grab; text width is stable mid-drag)
  private _ovDown(e: PointerEvent, key: string) {
    e.preventDefault(); e.stopPropagation();
    this._drag = key;
    // Remember exactly WHERE on the box the user grabbed, so that point stays under the
    // cursor while dragging (instead of the box jumping its anchor edge to the cursor).
    const el = e.currentTarget as HTMLElement | null;
    if (el) {
      const b = el.getBoundingClientRect();
      this._dragGrabX = e.clientX - b.left;
      this._dragGrabY = e.clientY - b.top;
      this._dragW = b.width;
    } else {
      this._dragGrabX = 0; this._dragGrabY = 0; this._dragW = 0;
    }
    window.addEventListener("pointermove", this._ovMove);
    window.addEventListener("pointerup", this._ovUp);
  }
  private _ovMove = (e: PointerEvent) => {
    if (!this._drag) return;
    const stage = this.renderRoot.querySelector(".tl-stage") as HTMLElement;
    if (!stage) return;
    const r = stage.getBoundingClientRect();
    const boxW = this._dragW || 0;
    // Keep the grabbed point under the cursor: position the box's left/top from the cursor
    // minus the grab offset, then clamp the whole box inside the stage.
    let leftX = e.clientX - this._dragGrabX;
    let topY = e.clientY - this._dragGrabY;
    leftX = Math.max(r.left, Math.min(leftX, r.right - boxW));
    topY = Math.max(r.top, Math.min(topY, r.top + r.height * 0.92));
    // Anchor to the nearer side so long readings never run off: if the box CENTRE is past
    // the midline, store the RIGHT-edge % (render reads x>50 as right-anchored), else the
    // LEFT-edge %. Both describe the same pixel box, so crossing the midline doesn't jump.
    const centerPct = ((leftX + boxW / 2 - r.left) / r.width) * 100;
    const edgeX = centerPct > 50 ? (leftX + boxW) : leftX;
    const x = Math.max(0, Math.min(100, Math.round(((edgeX - r.left) / r.width) * 100)));
    const y = Math.max(0, Math.min(92, Math.round(((topY - r.top) / r.height) * 100)));
    const pos = { ...(this._cfg.overlay_pos || {}) };
    pos[this._drag] = [x, y];
    this._setCfg({ overlay_pos: pos });
  };
  private _ovUp = () => {
    window.removeEventListener("pointermove", this._ovMove);
    window.removeEventListener("pointerup", this._ovUp);
    this._drag = null;
  };
  // Colour pinwheel (self-contained HSV wheel; emits a hex colour).
  private _hsv2rgb(h: number, s: number, v: number): [number, number, number] {
    const c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c;
    let r = 0, g = 0, b = 0;
    if (h < 60) { r = c; g = x; } else if (h < 120) { r = x; g = c; }
    else if (h < 180) { g = c; b = x; } else if (h < 240) { g = x; b = c; }
    else if (h < 300) { r = x; b = c; } else { r = c; b = x; }
    return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
  }
  private _drawWheel(canvas: HTMLCanvasElement) {
    if (!canvas || (canvas as any)._drawn) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    (canvas as any)._drawn = true;
    const W = canvas.width, H = canvas.height, cx = W / 2, cy = H / 2, R = Math.min(cx, cy);
    const img = ctx.createImageData(W, H), d = img.data;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      const dx = x - cx, dy = y - cy, dist = Math.sqrt(dx * dx + dy * dy), i = (y * W + x) * 4;
      if (dist > R) { d[i + 3] = 0; continue; }
      let h = Math.atan2(dy, dx) * 180 / Math.PI; if (h < 0) h += 360;
      const [r, g, b] = this._hsv2rgb(h, dist / R, 1);
      d[i] = r; d[i + 1] = g; d[i + 2] = b; d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
  }
  private _wheelPick(e: PointerEvent, canvas: HTMLCanvasElement) {
    const r = canvas.getBoundingClientRect();
    const cx = r.width / 2, cy = r.height / 2, R = Math.min(cx, cy);
    const dx = e.clientX - r.left - cx, dy = e.clientY - r.top - cy;
    let h = Math.atan2(dy, dx) * 180 / Math.PI; if (h < 0) h += 360;
    const s = Math.min(1, Math.sqrt(dx * dx + dy * dy) / R);
    const [rr, gg, bb] = this._hsv2rgb(h, s, 1);
    this._setCfg({ overlay_color: "#" + [rr, gg, bb].map((n) => n.toString(16).padStart(2, "0")).join("") });
  }
  private _wheelDown(e: PointerEvent) {
    const canvas = e.currentTarget as HTMLCanvasElement;
    this._wheelPick(e, canvas);
    const mv = (ev: PointerEvent) => this._wheelPick(ev, canvas);
    const up = () => { window.removeEventListener("pointermove", mv); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", mv);
    window.addEventListener("pointerup", up);
  }
  updated() {
    const c = this.renderRoot.querySelector(".tl-wheel") as HTMLCanvasElement | null;
    if (c) this._drawWheel(c);
    // While waiting for the first aligned frame, tick once a second so the countdown
    // stays live; stop as soon as frames arrive or capture stops.
    const st = this._statusEntity();
    const waiting = !!(st && st.attributes.capturing && !this._frames.length && st.attributes.next_capture);
    if (waiting && !this._waitTick) this._waitTick = setInterval(() => this.requestUpdate(), 1000);
    else if (!waiting && this._waitTick) { clearInterval(this._waitTick); this._waitTick = null; }
  }
  private _waitMsg(st: any): string {
    const nc = st && st.attributes.next_capture;
    if (!nc) return "Waiting for the first frame…";
    const t = new Date(nc);
    const ms = t.getTime() - Date.now();
    if (ms <= 0) return "Capturing…";
    const s = Math.ceil(ms / 1000), m = Math.floor(s / 60), sec = s % 60;
    const h24 = t.getHours(), ampm = h24 < 12 ? "AM" : "PM";
    const h12 = ((h24 + 11) % 12) + 1, mm = String(t.getMinutes()).padStart(2, "0");
    const left = m > 0 ? `${m}m ${sec}s` : `${sec}s`;
    return `First frame at ${h12}:${mm} ${ampm} · in ${left}`;
  }
  private _settingsPanel() {
    const c = this._cfg || {};
    const fields = [["timestamp", "Timestamp"], ["day", "Day"], ["temp", "Temp"], ["humidity", "Humidity"], ["vpd", "VPD"], ["co2", "CO2"], ["ppfd", "PPFD"]];
    // Camera, Title, Interval and Storage folder are set at card SETUP (the editor:
    // ⋮ → Edit) — this ⚙ panel is operational settings only. The interval comes from
    // the live status so the "Capture daily at" row knows when it's a 1-day lapse.
    const curIv = Number(this._statusEntity()?.attributes?.interval_s) || 300;
    return html`<div class="tl-settings">
      <div class="tl-grid">
        <label class="tl-field"><span>Keep (days)</span>
          <input type="number" min="1" .value=${String(c.retention ?? 7)} @change=${(e: any) => this._setCfg({ retention: Number(e.target.value) })} /></label>
      </div>
      ${curIv === 86400 ? html`<label class="tl-row"><span>Capture daily at</span>
        <input type="time" class="tl-narrow" .value=${live(c.daily_at || "00:00")}
          @change=${(e: any) => this._setCfg({ daily_at: e.target.value })} /></label>` : nothing}
      <div class="tl-checks">
        <label class="tl-check"><input type="checkbox" .checked=${!!c.enabled} @change=${(e: any) => this._setCfg({ enabled: e.target.checked })} />Enable capture</label>
        <label class="tl-check"><input type="checkbox" .checked=${!!c.overlay} @change=${(e: any) => this._setCfg({ overlay: e.target.checked })} />Env overlay</label>
        <label class="tl-check"><input type="checkbox" .checked=${!!c.overlay_burn} @change=${(e: any) => this._setCfg({ overlay_burn: e.target.checked })} />Burn into video</label>
        <label class="tl-check" title="On: first frame lands on the next 5/10/15… clock mark. Off: start right away.">
          <input type="checkbox" .checked=${c.align !== false} @change=${(e: any) => this._setCfg({ align: e.target.checked })} />Start on the mark</label>
      </div>
      ${c.overlay ? html`
        <div class="tl-row tl-adj">
          <span>Read env from</span>
          <select class="tl-xnarrow" .value=${live(c.overlay_panel || "")} @change=${(e: any) => this._setCfg({ overlay_panel: e.target.value })}>
            ${this._panelList().map((p) => html`<option value=${p} ?selected=${c.overlay_panel === p}>${p}</option>`)}
          </select>
          <span class="tl-gap">Text size</span>
          <select class="tl-xnarrow" .value=${live(String(Number(c.overlay_font) || 12))}
            @change=${(e: any) => this._setCfg({ overlay_font: Number(e.target.value) })}>
            ${Array.from({ length: 16 }, (_, i) => i + 5).map((f) => html`<option value=${String(f)} ?selected=${(Number(c.overlay_font) || 12) === f}>${f}</option>`)}
          </select>
        </div>
        <div class="tl-fields">${fields.map(([k, lab]) => html`
          <button class="tl-chip ${(c.overlay_fields || []).includes(k) ? "on" : ""}"
            @click=${() => this._toggleField(k)}>${lab}</button>`)}</div>
        <label class="tl-row"><span>Text colour</span>
          <span class="tl-wheelwrap">
            <canvas class="tl-wheel" width="104" height="104"
              @pointerdown=${(e: any) => this._wheelDown(e)}></canvas>
            <span class="tl-swatch" style="background:${c.overlay_color || '#ffffff'}"></span>
          </span></label>
        <div class="tl-checks">
          <label class="tl-check"><input type="checkbox" .checked=${c.overlay_grouped !== false}
            @change=${(e: any) => this._setCfg({ overlay_grouped: e.target.checked })} />All together</label>
          <label class="tl-check" title="Off: show just the values (e.g. 72°F) without the Temp/RH labels">
            <input type="checkbox" .checked=${c.overlay_labels !== false}
              @change=${(e: any) => this._setCfg({ overlay_labels: e.target.checked })} />Show labels</label>
          ${c.overlay_grouped !== false ? html`<span class="tl-inline"><span>Layout</span>
            <select class="tl-narrow" .value=${live(c.overlay_orient === "h" ? "h" : "v")}
              @change=${(e: any) => this._setCfg({ overlay_orient: e.target.value })}>
              <option value="v" ?selected=${c.overlay_orient !== "h"}>Vertical</option>
              <option value="h" ?selected=${c.overlay_orient === "h"}>Horizontal</option>
            </select></span>` : nothing}
        </div>
        <div class="tl-hint">${c.overlay_grouped !== false
          ? "Readings stack in one box, in the order selected above. Drag the box on the image to place it."
          : "Drag each reading on the image to place it independently."}</div>` : nothing}
      ${this._instances.length ? html`
        <div class="tl-manage">
          <div class="tl-manage-h">Time-lapses (tap 🗑, then confirm, to delete — images included)</div>
          ${this._instances.map((it) => {
            const nm = it.label || this._camFriendly(it.camera) || it.name;
            const arm = this._rmConfirm === it.tl_id;
            return html`
            <div class="tl-manage-row">
              <span class="tl-manage-name">${nm}${it.tl_id === this.config.tl_id ? " (this card)" : ""}
                <span class="tl-manage-sub">${(it.camera || "—").replace("camera.", "")} · ${(it.status && it.status.frame_count) || 0} frames</span></span>
              <button class="tl-xbtn ${arm ? "danger" : ""}" title="Delete this time-lapse and its images"
                @click=${() => arm ? this._removeInstance(it.tl_id) : this._armRemove(it.tl_id)}>${arm ? "Delete?" : "🗑"}</button>
            </div>`; })}
        </div>` : nothing}
      <div class="tl-apply">
        <button class="tl-ctl" @click=${() => this._applySettings()}>Apply</button>
        <button class="tl-ctl" @click=${() => { this._settingsOpen = false; }}>Cancel</button>
      </div>
    </div>`;
  }

  private _fmt(stamp: string): string {
    const m = /^(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})(\d{2})$/.exec(stamp || "");
    return m ? `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}:${m[6]}` : (stamp || "");
  }
  private _fmtSize(n: number): string {
    if (!n) return "";
    const u = ["B", "KB", "MB", "GB", "TB"]; let i = 0; let v = n;
    while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
    return `${v.toFixed(v < 10 && i > 0 ? 1 : 0)} ${u[i]}`;
  }
  private _fmtInterval(s: any): string {
    const n = Number(s) || 0;
    const map: any = { 300: "5 min", 600: "10 min", 900: "15 min", 1800: "30 min", 2700: "45 min", 3600: "1 hr", 86400: "1 day" };
    if (map[n]) return map[n];
    if (n >= 86400) return `${Math.round(n / 86400)} day`;
    if (n >= 3600) return `${Math.round(n / 3600)} hr`;
    if (n >= 60) return `${Math.round(n / 60)} min`;
    return `${n}s`;
  }

  render() {
    const st = this._statusEntity();
    if (!st) {
      // Camera already chosen in the editor (e.g. after a delete) → one-tap re-create,
      // so you don't have to re-pick the same camera. Otherwise point to the editor.
      if (this.config.camera) {
        return html`<ha-card><div class="tl-note">Ready to create this time-lapse.
          <div style="margin-top:8px"><button class="tl-ctl" @click=${() => this._setupFromConfig()}>Set up ${this.config.title || this._camFriendly(this.config.camera)}</button></div>
          <div style="margin-top:6px">This makes its folder and starts the time-lapse. Change the
          camera, title, interval or folder in the editor (⋮ → Edit) first if needed. To remove this
          card, edit the dashboard and delete the card.</div></div></ha-card>`;
      }
      return html`<ha-card><div class="tl-note">Time-lapse not set up yet. Open this card's
        editor (⋮ → Edit) and choose a camera. Give it a title and storage folder there too;
        set the interval and env overlay from the ⚙ settings.</div></ha-card>`;
    }
    const capturing = !!st.attributes.capturing;
    const exporting = !!st.attributes.export_running;
    const lastExport = st.attributes.last_export;
    const cur = this._frames[this._idx];
    const total = this._frames.length;
    return html`<ha-card>
      <div class="tl-head">
        <span>${this._displayName(st)}</span>
        <span class="tl-right">
          <span class="tl-sub">${capturing ? "● capturing" : "idle"} · ${this._fmtInterval(st.attributes.interval_s)} · ${st.attributes.frame_count ?? 0} frames${this._sizeBytes ? " · " + this._fmtSize(this._sizeBytes) : ""}</span>
          <ha-icon class="tl-gear" icon="mdi:cog" @click=${() => this._settingsOpen ? (this._settingsOpen = false) : this._openSettings()}></ha-icon>
        </span>
      </div>
      <div class="tl-stage">
        ${cur ? html`<img src=${cur.url} alt="frame" decoding="sync"
                @error=${() => this._onFrameError()} />`
              : html`<div class="tl-empty">${capturing ? this._waitMsg(st) : "No frames yet"}</div>`}
        ${this._overlayOn(st) ? this._overlayItems(cur).map((it) => {
          // Snap to the nearer side: an item on the right half anchors its RIGHT edge
          // (text grows left) so long readings don't run off the right edge; left half
          // anchors its left edge as before.
          const right = it.x > 50;
          const side = right ? `right:${100 - it.x}%` : `left:${it.x}%`;
          return html`
          <div class="tl-ov ${this._settingsOpen ? "drag" : ""}"
            style="${side}; top:${it.y}%; text-align:${right ? "right" : "left"}; font-size:${Number(this._ovActive().overlay_font) || 12}px; color:${this._ovActive().overlay_color || "#ffffff"}"
            @pointerdown=${this._settingsOpen ? (e: any) => this._ovDown(e, it.key) : null}>${it.text}</div>`; }) : nothing}
      </div>
      ${this._settingsOpen ? this._settingsPanel() : nothing}
      <div class="tl-scrub">
        <button class="tl-btn" title=${this._playing ? "Pause" : "Play"}
          @click=${() => this._toggle()}>${this._playing ? "⏸" : "▶"}</button>
        <input type="range" min="0" max=${Math.max(0, total - 1)} .value=${String(this._idx)}
          @input=${(e: any) => { this._stopPlay(); this._idx = Number(e.target.value); }} />
        <span class="tl-count">${total ? this._idx + 1 : 0}/${total}</span>
      </div>
      <div class="tl-time">${cur ? this._fmt(cur.stamp) : ""}</div>
      <div class="tl-controls">
        ${capturing
          ? html`<button class="tl-ctl" @click=${() => this._stopCapture()}>Stop capture</button>`
          : html`<button class="tl-ctl" @click=${() => this._startCapture()}>Start capture</button>`}
        ${total ? html`<button class="tl-ctl" ?disabled=${exporting}
          @click=${() => this._export()}>${exporting ? "Exporting…" : "Export MP4"}</button>` : nothing}
        ${lastExport ? html`<button class="tl-ctl" @click=${() => this._download()}>Download MP4</button>` : nothing}
        ${total ? html`<button class="tl-ctl tl-danger" @click=${() => this._clearAll()}>Delete all images</button>` : nothing}
      </div>
      ${st.attributes.last_export_error
        ? html`<div class="tl-err">Export failed: ${st.attributes.last_export_error}</div>` : nothing}
    </ha-card>`;
  }

  static styles = css`
    ha-card { overflow: hidden; }
    .tl-head { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px 6px; font-weight: 600; }
    .tl-sub { font-weight: 400; color: var(--secondary-text-color); font-size: .9em; }
    .tl-stage { background: #000; aspect-ratio: 16 / 9; display: flex; align-items: center; justify-content: center; }
    .tl-stage img { width: 100%; height: 100%; object-fit: contain; display: block; }
    .tl-empty { color: var(--secondary-text-color); }
    .tl-note { padding: 16px; color: var(--secondary-text-color); }
    .tl-scrub { display: flex; align-items: center; gap: 10px; padding: 8px 14px 2px; }
    .tl-scrub input[type=range] { flex: 1; }
    .tl-btn { background: var(--primary-color); color: #fff; border: none; border-radius: 6px; width: 34px; height: 30px; cursor: pointer; font-size: 14px; }
    .tl-count { color: var(--secondary-text-color); font-size: .85em; min-width: 52px; text-align: right; }
    .tl-time { text-align: center; color: var(--secondary-text-color); font-size: .85em; padding: 0 14px; min-height: 1em; }
    .tl-controls { display: flex; gap: 8px; padding: 10px 14px 14px; }
    .tl-ctl { background: var(--secondary-background-color); color: var(--primary-text-color); border: 1px solid var(--divider-color); border-radius: 6px; padding: 7px 12px; cursor: pointer; }
    .tl-ctl:hover { border-color: var(--primary-color); }
    .tl-ctl[disabled] { opacity: .6; cursor: default; border-color: var(--divider-color); }
    .tl-danger { color: var(--error-color, #c00); margin-left: auto; }
    .tl-danger:hover { border-color: var(--error-color, #c00); }
    .tl-err { color: var(--error-color, #c00); padding: 0 14px 12px; font-size: .85em; }
    .tl-right { display: inline-flex; align-items: center; gap: 8px; }
    .tl-gear { cursor: pointer; color: var(--secondary-text-color); --mdc-icon-size: 18px; }
    .tl-gear:hover { color: var(--primary-text-color); }
    .tl-stage { position: relative; }
    .tl-overlay { position: absolute; left: 10px; bottom: 10px; background: rgba(0,0,0,.55); color: #fff; padding: 6px 9px; border-radius: 5px; font-size: .85em; line-height: 1.3; white-space: pre; pointer-events: none; }
    .tl-ov { position: absolute; background: rgba(0,0,0,.5); padding: 3px 7px; border-radius: 4px; font-family: "SF Overlay", var(--primary-font-family, sans-serif); font-size: .8em; line-height: 1.25; white-space: pre; width: max-content; max-width: 96%; pointer-events: none; text-shadow: 0 1px 2px rgba(0,0,0,.85); }
    .tl-ov.drag { pointer-events: auto; cursor: move; outline: 1px dashed rgba(255,255,255,.65); touch-action: none; }
    .tl-wheelwrap { display: inline-flex; align-items: center; gap: 10px; }
    .tl-wheel { border-radius: 50%; cursor: crosshair; touch-action: none; }
    .tl-swatch { width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--divider-color); display: inline-block; }
    .tl-hint { color: var(--secondary-text-color); font-size: .8em; padding: 2px 0 4px; }
    .tl-manage { border-top: 1px solid var(--divider-color); margin-top: 6px; padding-top: 8px; }
    .tl-manage-h { font-size: .8em; color: var(--secondary-text-color); margin-bottom: 4px; }
    .tl-manage-row { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 3px 0; }
    .tl-manage-name { font-size: .88em; display: flex; flex-direction: column; }
    .tl-manage-sub { color: var(--secondary-text-color); font-size: .82em; }
    .tl-xbtn { background: none; border: none; cursor: pointer; font-size: 1em; opacity: .8; color: inherit; }
    .tl-xbtn:hover { opacity: 1; }
    .tl-xbtn.danger { opacity: 1; color: var(--error-color, #db4437); font-weight: 600; font-size: .85em;
      border: 1px solid var(--error-color, #db4437); border-radius: 6px; padding: 2px 8px; }
    .tl-settings { padding: 8px 14px 12px; border-bottom: 1px solid var(--divider-color); }
    .tl-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px 14px; padding: 2px 0 4px; }
    .tl-field { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
    .tl-field > span { color: var(--secondary-text-color); font-size: .8em; }
    .tl-field select, .tl-field input { width: 100%; box-sizing: border-box; }
    .tl-field input.tl-text { padding: 4px 6px; border: 1px solid var(--divider-color);
      border-radius: 4px; background: var(--card-background-color);
      color: var(--primary-text-color); font: inherit; }
    .tl-checks { display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; padding: 6px 0; }
    .tl-check { display: inline-flex; align-items: center; gap: 6px; font-size: .85em; color: var(--secondary-text-color); cursor: pointer; }
    .tl-inline { display: inline-flex; align-items: center; gap: 6px; font-size: .85em; color: var(--secondary-text-color); }
    .tl-narrow { max-width: 150px; }
    .tl-row select.tl-xnarrow { max-width: 96px; flex: 0 0 auto; }
    .tl-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 4px 0; font-size: .9em; }
    .tl-row.tl-adj { justify-content: flex-start; gap: 10px; flex-wrap: wrap; }
    .tl-row.tl-adj > select { flex: 0 0 auto; }
    .tl-row.tl-adj .tl-gap { margin-left: 6px; }
    .tl-row > span { color: var(--secondary-text-color); }
    .tl-row select, .tl-row input[type=text], .tl-row input[type=number] { max-width: 60%; flex: 1; }
    .tl-fields { display: flex; flex-wrap: wrap; gap: 6px; padding: 6px 0 2px; }
    .tl-chip { background: var(--secondary-background-color); color: var(--secondary-text-color); border: 1px solid var(--divider-color); border-radius: 12px; padding: 3px 10px; cursor: pointer; font-size: .85em; }
    .tl-chip.on { background: var(--primary-color); color: #fff; border-color: var(--primary-color); }
    .tl-apply { display: flex; gap: 8px; padding-top: 8px; }
  `;
}

// Card editor — set up the time-lapse: camera (picker), title (synced server-side),
// and secure storage folder, all at card setup. Operational options live on the ⚙.
export class SpiderTimelapseCardEditor extends LitElement {
  @property({ attribute: false }) hass!: any;
  @state() private _config: any = {};
  @state() private _storageCustom = false;
  setConfig(config: any) {
    this._config = config || {};
    // A storage_dir that isn't this card's computed default means the user chose Custom.
    this._storageCustom = !!this._config.storage_dir && this._config.storage_dir !== this._defDir();
  }

  private _interval(): number { return Number(this._config.interval) || 300; }
  private _intervalOpts(): [number, string][] {
    return [[300, "5 min"], [600, "10 min"], [900, "15 min"], [1200, "20 min"],
      [1800, "30 min"], [3600, "1 hour"], [86400, "1 day"]];
  }
  private _camFriendly(cam?: string): string {
    const id = cam || this._config.camera || "";
    if (!id) return "";
    const fn = (this.hass?.states[id]?.attributes?.friendly_name as string) || "";
    return fn || String(id).replace(/^camera\./, "");
  }
  private _defDir(cfg: any = this._config): string {
    return "/media/sf_timelapse/" + tlBaseName(cfg.title, cfg.camera, Number(cfg.interval) || 300);
  }
  private _storagePresets(): string[] {
    const base = [this._defDir(), "/media/sf_timelapse", "/share/sf_timelapse", "/config/sf_timelapse"];
    return base.filter((p, i) => base.indexOf(p) === i);
  }
  // Apply a change: recompute the tl_id + default folder (Title_camera_interval) and
  // update the card config. NO server-side writes here — the instance/folder is created
  // once, explicitly, when the user taps "Set up" on the card. (Writing on every edit
  // spawned an orphan folder per intermediate camera/title/interval.)
  private _apply(patch: any) {
    const cfg = { ...this._config, ...patch };
    const interval = Number(cfg.interval) || 300;
    if (cfg.camera) cfg.tl_id = tlIdFor(cfg.title, cfg.camera, interval);
    cfg.storage_dir = (this._storageCustom && cfg.storage_dir) ? cfg.storage_dir : this._defDir(cfg);
    this._config = cfg;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config: cfg }, bubbles: true, composed: true }));
  }
  render() {
    const iv = this._intervalOpts();
    const curIv = this._interval();
    const presets = this._storagePresets();
    const curDir = (this._storageCustom && this._config.storage_dir) ? this._config.storage_dir : this._defDir();
    const isCustom = this._storageCustom;
    return html`<div class="ed">
      <div class="ed-note">Set up the time-lapse: camera, a title, the capture interval and a
        secure storage folder. The folder is named Title_camera_interval, so the same camera on
        two cards at different intervals are separate time-lapses. Retention and the env overlay
        are on the card's ⚙ settings.</div>
      <label class="ed-field"><span>Camera</span>
        <ha-entity-picker .hass=${this.hass} .value=${this._config.camera || ""}
          .includeDomains=${["camera"]} allow-custom-entity
          @value-changed=${(e: any) => this._apply({ camera: e.detail.value })}></ha-entity-picker></label>
      <label class="ed-field"><span>Title (optional — defaults to the camera name)</span>
        <input type="text" class="ed-input" .value=${this._config.title || ""}
          placeholder=${this._camFriendly() || "camera name"}
          @change=${(e: any) => this._apply({ title: e.target.value })}></label>
      <label class="ed-field"><span>Interval</span>
        <select class="ed-input" .value=${live(String(curIv))}
          @change=${(e: any) => this._apply({ interval: Number(e.target.value) })}>
          ${iv.map(([s, lab]) => html`<option value=${String(s)} ?selected=${curIv === s}>${lab}</option>`)}
        </select></label>
      ${curIv === 86400 ? html`<label class="ed-field"><span>Capture daily at (time of day)</span>
        <input type="time" class="ed-input" .value=${this._config.daily_at || "00:00"}
          @change=${(e: any) => this._apply({ daily_at: e.target.value })}></label>` : nothing}
      <label class="ed-field"><span>Storage folder (secure — never /www)</span>
        <select class="ed-input" .value=${live(isCustom ? "__custom__" : curDir)}
          @change=${(e: any) => { const v = e.target.value; if (v === "__custom__") { this._storageCustom = true; } else { this._storageCustom = false; this._apply({ storage_dir: v }); } }}>
          ${presets.map((p) => html`<option value=${p} ?selected=${!isCustom && curDir === p}>${p}</option>`)}
          <option value="__custom__" ?selected=${isCustom}>Custom…</option>
        </select></label>
      ${isCustom ? html`<label class="ed-field"><span>Custom folder</span>
        <input type="text" class="ed-input" .value=${this._config.storage_dir || curDir} placeholder="/media/… (never /www)"
          @change=${(e: any) => this._apply({ storage_dir: e.target.value })}></label>` : nothing}
    </div>`;
  }
  static styles = css`
    .ed { display: flex; flex-direction: column; gap: 12px; padding: 8px 4px; }
    .ed-note { color: var(--secondary-text-color); font-size: .9em; }
    ha-entity-picker { display: block; width: 100%; }
    .ed-field { display: flex; flex-direction: column; gap: 4px; font-size: .9em; }
    .ed-field > span { color: var(--secondary-text-color); }
    .ed-field select, .ed-input { padding: 7px 8px; box-sizing: border-box; width: 100%;
      border: 1px solid var(--divider-color); border-radius: 6px;
      background: var(--card-background-color); color: var(--primary-text-color); font: inherit; }
  `;
}

// PPFD card editor — visual setup (no YAML). Plain inputs (ha-textfield doesn't render
// reliably inside the card-editor context). Each card gets a unique card_id so two PPFD
// cards never share saved settings.
export class SpiderPpfdCardEditor extends LitElement {
  @property({ attribute: false }) hass!: any;
  @state() private _config: any = {};
  setConfig(config: any) { this._config = config || {}; }

  protected updated() {
    if (this.hass && this._config && this._config.type && !this._config.card_id) {
      this._emit({ card_id: "ppfd_" + Math.random().toString(36).slice(2, 8) });
    }
  }
  private _emit(patch: any) {
    const config = { ...this._config, ...patch };
    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }
  private _set(key: string, v: any) { this._emit({ [key]: v }); }
  private _setDefault(key: string, v: any) { this._emit({ defaults: { ...(this._config.defaults || {}), [key]: v } }); }
  private _setTent(key: string, v: any) { this._emit({ tent: { ...(this._config.tent || {}), [key]: v } }); }
  private _models(): string[] { return Object.keys(PPFD_LIGHTS); }
  // Same sources as the card's Settings tab: SF lights + Schedule Brightness numbers.
  private _brightOptions(): { id: string; name: string }[] {
    const h = this.hass; if (!h) return [];
    return Object.keys(h.states).filter((id) =>
      id.startsWith("light.sf_") || (id.startsWith("number.sf_") && /schedule_brightness/i.test(id)))
      .sort().map((id) => ({ id, name: h.states[id].attributes.friendly_name || id }));
  }
  render() {
    const c = this._config || {};
    const d = c.defaults || {}, tent = c.tent || {};
    const n = (v: any, dv: number) => (v == null ? dv : v);
    return html`<div class="ped">
      <div class="ped-note">Set up the PPFD visualizer. Each card keeps its own settings.</div>
      <label class="pf"><span>Title</span>
        <input type="text" .value=${c.title || ""} @change=${(e: any) => this._set("title", e.target.value)}></label>
      <label class="pf"><span>Light model</span>
        <select .value=${live(c.light_model || "SE4500")} @change=${(e: any) => this._set("light_model", e.target.value)}>
          ${this._models().map((m) => html`<option value=${m} ?selected=${c.light_model === m}>${m}</option>`)}
        </select></label>
      <label class="pf"><span>Units</span>
        <select .value=${live(c.unit_system || "auto")} @change=${(e: any) => this._set("unit_system", e.target.value)}>
          <option value="auto">Auto (follow HA)</option>
          <option value="imperial">Imperial (in / ft)</option>
          <option value="metric">Metric (cm / m)</option>
        </select></label>
      <div class="ped-h">Brightness</div>
      <label class="pf pf-row"><input type="checkbox" .checked=${!!d.auto_brightness}
          @change=${(e: any) => this._setDefault("auto_brightness", e.target.checked)}>
        <span>Auto-read brightness from a light</span></label>
      <label class="pf"><span>Light source</span>
        <select .value=${live(d.brightness_source || "")} @change=${(e: any) => this._setDefault("brightness_source", e.target.value)}>
          <option value="" ?selected=${!d.brightness_source}>— none —</option>
          ${this._brightOptions().map((o) => html`<option value=${o.id} ?selected=${d.brightness_source === o.id}>${o.name}</option>`)}
        </select></label>
      <div class="ped-note">Pick a Spider Farmer light (live brightness) or a Schedule Brightness
        (target). This is the card's default — the card's own Settings tab can change it live.</div>
      <div class="ped-h">Defaults</div>
      <div class="pgrid">
        <label class="pf"><span>Light height (in)</span><input type="number" min="0" .value=${String(n(d.height_inches, 18))} @change=${(e: any) => this._setDefault("height_inches", Number(e.target.value))}></label>
        <label class="pf"><span>Plant height (in)</span><input type="number" min="0" .value=${String(n(d.plant_height_inches, 12))} @change=${(e: any) => this._setDefault("plant_height_inches", Number(e.target.value))}></label>
        <label class="pf"><span>Plants</span><input type="number" min="1" .value=${String(n(d.num_plants, 2))} @change=${(e: any) => this._setDefault("num_plants", Number(e.target.value))}></label>
        <label class="pf"><span>Brightness (%)</span><input type="number" min="0" max="100" .value=${String(n(d.dimmer_percent, 100))} @change=${(e: any) => this._setDefault("dimmer_percent", Number(e.target.value))}></label>
        <label class="pf"><span>Photoperiod (h)</span><input type="number" min="0" max="24" .value=${String(n(d.photoperiod_hours, 18))} @change=${(e: any) => this._setDefault("photoperiod_hours", Number(e.target.value))}></label>
      </div>
      <div class="ped-h">Tent size (ft)</div>
      <div class="pgrid">
        <label class="pf"><span>Width</span><input type="number" min="0" step="0.1" .value=${String(n(tent.width_ft, 2))} @change=${(e: any) => this._setTent("width_ft", Number(e.target.value))}></label>
        <label class="pf"><span>Length</span><input type="number" min="0" step="0.1" .value=${String(n(tent.length_ft, 4))} @change=${(e: any) => this._setTent("length_ft", Number(e.target.value))}></label>
        <label class="pf"><span>Height</span><input type="number" min="0" step="0.1" .value=${String(n(tent.height_ft, 6.5))} @change=${(e: any) => this._setTent("height_ft", Number(e.target.value))}></label>
      </div>
    </div>`;
  }
  static styles = css`
    .ped { display: flex; flex-direction: column; gap: 10px; padding: 8px 4px; }
    .ped-note { color: var(--secondary-text-color); font-size: .9em; }
    .ped-h { font-weight: 600; margin-top: 4px; }
    .pf { display: flex; flex-direction: column; gap: 3px; font-size: .9em; }
    .pf.pf-row { flex-direction: row; align-items: center; gap: 8px; }
    .pf.pf-row > span { color: var(--primary-text-color); }
    .pf.pf-row input { width: auto; }
    .pf > span { color: var(--secondary-text-color); }
    .pf select, .pf input { padding: 6px 8px; box-sizing: border-box; width: 100%;
      border: 1px solid var(--divider-color); border-radius: 6px;
      background: var(--card-background-color); color: var(--primary-text-color); font: inherit; }
    .pgrid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  `;
}

// Visual config editor for the SE light card — same picker GUI as the other
// cards (no YAML needed). Pick the SE light, give it a title and an accent.
export class SpiderLightCardEditor extends LitElement {
  @property({ attribute: false }) hass!: any;
  @state() private _config: any = {};
  setConfig(config: any) { this._config = config || {}; }
  private _emit(patch: any) {
    const config = { ...this._config, ...patch };
    this._config = config;
    this.dispatchEvent(new CustomEvent("config-changed", { detail: { config }, bubbles: true, composed: true }));
  }
  private _set(key: string, v: any) { this._emit({ [key]: v }); }
  private _seLights(): { slot: string; name: string }[] {
    const h = this.hass; if (!h) return [];
    return seLightSlots(h).map((slot) => ({ slot, name: slotDeviceName(h, slot) || `SE light (${slot})` }));
  }
  render() {
    const c = this._config || {};
    const lights = this._seLights();
    return html`<div class="ped">
      <div class="ped-note">Set up the Spider Farmer SE light card. Each card keeps its own settings.</div>
      <label class="pf"><span>Title</span>
        <input type="text" .value=${c.title || ""} placeholder="Spider Light"
          @change=${(e: any) => this._set("title", e.target.value)}></label>
      <label class="pf"><span>SE light</span>
        <select .value=${live(c.light || "")} @change=${(e: any) => this._set("light", e.target.value)}>
          <option value="" ?selected=${!c.light}>Auto (first found)</option>
          ${lights.map((l) => html`<option value=${l.slot} ?selected=${c.light === l.slot}>${l.name}</option>`)}
        </select></label>
      ${lights.length === 0
        ? html`<div class="ped-note">No Spider Farmer SE light found yet — add the card once the light is online, or leave it on Auto.</div>`
        : nothing}
      <label class="pf"><span>Accent colour</span>
        <input type="color" .value=${c.accent || ACCENT_DEFAULT}
          @change=${(e: any) => this._set("accent", e.target.value)}></label>
    </div>`;
  }
  static styles = css`
    .ped { display: flex; flex-direction: column; gap: 10px; padding: 8px 4px; }
    .ped-note { color: var(--secondary-text-color); font-size: .9em; }
    .pf { display: flex; flex-direction: column; gap: 3px; font-size: .9em; }
    .pf > span { color: var(--secondary-text-color); }
    .pf select, .pf input { padding: 6px 8px; box-sizing: border-box; width: 100%;
      border: 1px solid var(--divider-color); border-radius: 6px;
      background: var(--card-background-color); color: var(--primary-text-color); font: inherit; }
    .pf input[type="color"] { height: 38px; padding: 2px; }
  `;
}

if (!customElements.get("spider-light-card-editor")) {
  customElements.define("spider-light-card-editor", SpiderLightCardEditor);
}
if (!customElements.get("spider-ppfd-card-editor")) {
  customElements.define("spider-ppfd-card-editor", SpiderPpfdCardEditor);
}
if (!customElements.get("spider-farmer-card")) {
  customElements.define("spider-farmer-card", SpiderFarmerCard);
}
if (!customElements.get("spider-timelapse-card")) {
  customElements.define("spider-timelapse-card", SpiderTimelapseCard);
}
if (!customElements.get("spider-timelapse-card-editor")) {
  customElements.define("spider-timelapse-card-editor", SpiderTimelapseCardEditor);
}
if (!customElements.get("spider-farmer-card-editor")) {
  customElements.define("spider-farmer-card-editor", SpiderFarmerCardEditor);
}
if (!customElements.get("spider-light-card")) {
  customElements.define("spider-light-card", SpiderLightCard);
}
if (!customElements.get("ppfd-3d-card")) {
  customElements.define("ppfd-3d-card", SpiderPpfdCard);
}

// Register in the card picker, de-duped by type: if this bundle is loaded more
// than once (e.g. a manually-added resource plus the integration's auto-install),
// only one entry per card shows in HA's "Add card" list.
const _sfCards: any[] = ((window as any).customCards = (window as any).customCards || []);
const _sfRegisterCard = (def: any) => {
  if (!_sfCards.some((c) => c && c.type === def.type)) _sfCards.push(def);
};
_sfRegisterCard({
  type: "spider-farmer-card",
  name: "Spider Farmer Card",
  description: "Tent overview + config for the Spider Farmer Bridge integration",
  preview: true,
  documentationURL: "https://github.com/cobragt2000/spider_farmer_bridge",
});
_sfRegisterCard({
  type: "spider-light-card",
  name: "Spider Light Card",
  description: "Brightness dial, mode, and schedule for a Spider Farmer SE-series light",
  preview: true,
  documentationURL: "https://github.com/cobragt2000/spider_farmer_bridge",
});
_sfRegisterCard({
  type: "ppfd-3d-card",
  name: "PPFD 3D Grow Light Card",
  description: "3D PPFD visualizer for Spider Farmer SE4500, SE5000, SF2000, SF7000 & G1000W",
  preview: true,
  documentationURL: "https://github.com/cobragt2000/spider_farmer_bridge",
});
_sfRegisterCard({
  type: "spider-timelapse-card",
  name: "Spider Time-lapse Card",
  description: "Play back a grow time-lapse captured by the Spider Farmer Bridge integration",
  preview: true,
  documentationURL: "https://github.com/cobragt2000/spider_farmer_bridge",
});

console.info(
  `%c SPIDER-FARMER-CARD %c v${CARD_VERSION} `,
  "color:#fff;background:#ff7a1a;border-radius:3px 0 0 3px;padding:2px 4px",
  "color:#ff7a1a;background:#222;border-radius:0 3px 3px 0;padding:2px 4px"
);

// ---------------------------------------------------------------------------
// Cold-load self-heal.
//
// On a cache-cold refresh Home Assistant can build a view's cards before this
// (large) module has registered its elements. When that happens HA renders a
// "Configuration error" card and does not reliably rebuild it once the element
// finally appears, so the user has to refresh again — the recurring bug.
//
// HA *does* rebuild an error card the moment its custom element becomes
// defined. So we make two guarantees, cheaply and idempotently:
//   1. force-ensure our elements are actually registered (belt-and-suspenders
//      over the guarded defines above), which triggers HA's own rebuild; and
//   2. directly nudge any error card that is really one of ours by firing
//      `ll-rebuild`, so recovery is immediate even if HA's rebuild misses.
// It runs a few short passes to catch error cards HA builds just after us,
// then stops — no observers left running.
(() => {
  type Ctor = CustomElementConstructor;
  const OUR_TAGS = ["spider-farmer-card", "spider-light-card", "ppfd-3d-card", "spider-timelapse-card"];
  const OUR_TYPES = new Set([
    ...OUR_TAGS,
    ...OUR_TAGS.map((t) => `custom:${t}`),
  ]);

  const ensureDefined = () => {
    const defs: Array<[string, Ctor]> = [
      ["spider-farmer-card", SpiderFarmerCard as unknown as Ctor],
      ["spider-farmer-card-editor", SpiderFarmerCardEditor as unknown as Ctor],
      ["spider-light-card", SpiderLightCard as unknown as Ctor],
      ["spider-light-card-editor", SpiderLightCardEditor as unknown as Ctor],
      ["ppfd-3d-card", SpiderPpfdCard as unknown as Ctor],
      ["spider-timelapse-card", SpiderTimelapseCard as unknown as Ctor],
      ["spider-timelapse-card-editor", SpiderTimelapseCardEditor as unknown as Ctor],
    ];
    for (const [name, ctor] of defs) {
      if (!customElements.get(name)) {
        try {
          customElements.define(name, ctor);
        } catch {
          /* raced with another copy — already defined, fine */
        }
      }
    }
  };

  // Depth-first walk through open shadow roots collecting hui-error-cards.
  const findErrorCards = (): Element[] => {
    const found: Element[] = [];
    const seen = new Set<Document | ShadowRoot>();
    const rec = (root: Document | ShadowRoot) => {
      if (!root || seen.has(root)) return;
      seen.add(root);
      let hits: NodeListOf<Element> | never[] = [];
      try {
        hits = root.querySelectorAll("hui-error-card");
      } catch {
        return;
      }
      hits.forEach((n) => found.push(n));
      let all: NodeListOf<Element> | never[] = [];
      try {
        all = root.querySelectorAll("*");
      } catch {
        return;
      }
      all.forEach((el) => {
        const sr = (el as Element & { shadowRoot?: ShadowRoot | null })
          .shadowRoot;
        if (sr) rec(sr);
      });
    };
    rec(document);
    return found;
  };

  const heal = (): number => {
    let healed = 0;
    for (const node of findErrorCards()) {
      const cfg = (node as Element & { _config?: any })._config || {};
      const type: string =
        (cfg.origConfig && cfg.origConfig.type) || cfg.type || "";
      if (OUR_TYPES.has(type)) {
        node.dispatchEvent(
          new CustomEvent("ll-rebuild", { bubbles: true, composed: true })
        );
        healed++;
      }
    }
    return healed;
  };

  let passes = 0;
  const tick = () => {
    ensureDefined();
    heal();
    // Keep sweeping briefly (~3s) so error cards HA builds a beat after us also
    // get rebuilt, then stop regardless.
    if (++passes < 12) setTimeout(tick, 250);
  };
  const start = () => {
    ensureDefined();
    tick();
  };
  if (document.readyState === "complete") start();
  else window.addEventListener("load", start, { once: true });
})();
