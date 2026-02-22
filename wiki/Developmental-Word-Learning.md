# Developmental Word Learning

The analysis is based on data from [Wordbank](https://wordbank.stanford.edu/), an open repository of developmental vocabulary data from the MacArthur-Bates Communicative Development Inventories (CDI). The CDI is a widely-used parent report instrument for assessing early language development.

**Source:** [Wordbank Instrument Data](https://wordbank.stanford.edu/data/?name=instrument_data)

```nu
(open ./data/words_by_learning_age.csv) | select word mean_age num_children_produced | to md
```
> | word | mean_age | num_children_produced |
> | --- | --- | --- |
> | uh oh | 23 | 7817 |
> | ball | 23 | 8203 |
> | daddy* | 23 | 8453 |
> | mommy* | 23 | 8517 |
> | bye | 23 | 7987 |
> | baa baa | 24 | 6471 |
> | grrr | 24 | 6369 |
> | meow | 24 | 6979 |
> | moo | 24 | 7198 |
> | ouch | 24 | 6395 |
> | quack quack | 24 | 6425 |
> | vroom | 24 | 5807 |
> | woof woof | 24 | 7111 |
> | yum yum | 24 | 6098 |
> | dog | 24 | 7596 |
> | duck | 24 | 6497 |
> | car | 24 | 6932 |
> | book | 24 | 7160 |
> | banana | 24 | 7211 |
> | shoe | 24 | 7278 |
> | eye | 24 | 6907 |
> | nose | 24 | 6780 |
> | baby | 24 | 7283 |
> | grandma* | 24 | 6619 |
> | hello | 24 | 5926 |
> | hi | 24 | 7243 |
> | no | 24 | 7708 |
> | choo choo | 24 | 6045 |
> | bear | 24 | 5735 |
> | bird | 24 | 6571 |
> | cat | 24 | 6589 |
> | kitty | 24 | 5782 |
> | balloon | 24 | 6445 |
> | bubbles | 24 | 6428 |
> | apple | 24 | 6618 |
> | cheese | 24 | 6369 |
> | cookie | 24 | 6395 |
> | cracker | 24 | 5575 |
> | juice | 24 | 6153 |
> | milk | 24 | 6469 |
> | water (beverage) | 24 | 6134 |
> | hat | 24 | 6195 |
> | ear | 24 | 6388 |
> | owie/boo boo | 24 | 5744 |
> | bottle | 24 | 5611 |
> | grandpa* | 24 | 6087 |
> | pet's name | 24 | 4769 |
> | bath | 24 | 6317 |
> | night night | 24 | 6270 |
> | peekaboo | 24 | 5745 |
> | shh/shush/hush | 24 | 6102 |
> | thank you | 24 | 6563 |
> | yes | 24 | 6623 |
> | all gone | 24 | 5910 |
> | hot | 24 | 6200 |
> | up | 24 | 5701 |
> | bee | 25 | 5086 |
> | bug | 25 | 4675 |
> | bunny | 25 | 5266 |
> | cow | 25 | 5692 |
> | fish (animal) | 25 | 6091 |
> | frog | 25 | 4766 |
> | horse | 25 | 5356 |
> | monkey | 25 | 5237 |
> | owl | 25 | 4176 |
> | pig | 25 | 5276 |
> | puppy | 25 | 5176 |
> | turtle | 25 | 4537 |
> | airplane | 25 | 5541 |
> | boat | 25 | 5309 |
> | bus | 25 | 5422 |
> | train | 25 | 5375 |
> | truck | 25 | 6019 |
> | block | 25 | 4824 |
> | doll | 25 | 4425 |
> | toy (object) | 25 | 5071 |
> | bread | 25 | 4829 |
> | cheerios | 25 | 4089 |
> | drink (beverage) | 25 | 4784 |
> | egg | 25 | 4813 |
> | fish (food) | 25 | 4314 |
> | pizza | 25 | 5172 |
> | yogurt | 25 | 4461 |
> | bib | 25 | 3804 |
> | boots | 25 | 4771 |
> | button | 25 | 4315 |
> | coat | 25 | 4231 |
> | diaper | 25 | 5828 |
> | shirt | 25 | 4905 |
> | sock | 25 | 5562 |
> | belly button | 25 | 5322 |
> | buttocks/bottom* | 25 | 4655 |
> | finger | 25 | 4875 |
> | foot | 25 | 5361 |
> | hair | 25 | 5809 |
> | hand | 25 | 5259 |
> | head | 25 | 5160 |
> | mouth | 25 | 5633 |
> | toe | 25 | 5131 |
> | tooth | 25 | 4784 |
> | tummy | 25 | 5074 |
> | blanket | 25 | 5373 |
> | brush | 25 | 4703 |
> | cup | 25 | 5827 |
> | fork | 25 | 4822 |
> | keys | 25 | 5120 |
> | light | 25 | 5159 |
> | spoon | 25 | 5553 |
> | telephone | 25 | 5150 |
> | toothbrush | 25 | 4908 |
> | bathtub | 25 | 4614 |
> | bed | 25 | 5511 |
> | chair | 25 | 5305 |
> | door | 25 | 5492 |
> | potty | 25 | 5075 |
> | flower | 25 | 5426 |
> | moon | 25 | 5253 |
> | rock | 25 | 4546 |
> | star | 25 | 4624 |
> | swing (object) | 25 | 4536 |
> | tree | 25 | 5525 |
> | water (not beverage) | 25 | 5579 |
> | home | 25 | 4982 |
> | outside | 25 | 5456 |
> | babysitter's name | 25 | 3154 |
> | child's own name | 25 | 5732 |
> | please | 25 | 6333 |
> | drink (action) | 25 | 4772 |
> | eat | 25 | 5658 |
> | go | 25 | 5934 |
> | hug | 25 | 4897 |
> | kiss | 25 | 5171 |
> | open | 25 | 4878 |
> | sit | 25 | 4779 |
> | cold | 25 | 5129 |
> | yucky | 25 | 4585 |
> | me | 25 | 4789 |
> | mine | 25 | 5608 |
> | down | 25 | 5409 |
> | off | 25 | 4673 |
> | on | 25 | 4634 |
> | out | 25 | 4372 |
> | more | 25 | 5630 |
> | feet | 25 | 3997 |
> | teeth | 25 | 4714 |
> | shoeses | 25 | 528 |
> | sockses | 25 | 438 |
> | cockadoodledoo | 25 | 3429 |
> | chicken (animal) | 25 | 4515 |
> | elephant | 25 | 4624 |
> | lion | 25 | 4435 |
> | sheep | 25 | 4158 |
> | teddybear | 25 | 4068 |
> | bicycle | 25 | 4789 |
> | beans | 25 | 3426 |
> | cake | 25 | 4846 |
> | cereal | 25 | 4581 |
> | chicken (food) | 25 | 4513 |
> | food | 25 | 4189 |
> | grapes | 25 | 4636 |
> | ice | 25 | 4141 |
> | ice cream | 25 | 4770 |
> | noodles | 25 | 3789 |
> | peas | 25 | 3554 |
> | toast | 25 | 3880 |
> | pants | 25 | 4857 |
> | sweater | 25 | 3359 |
> | arm | 25 | 4833 |
> | cheek | 25 | 4097 |
> | knee | 25 | 4469 |
> | penis* | 25 | 2940 |
> | tongue | 25 | 4128 |
> | bowl | 25 | 4600 |
> | box | 25 | 4548 |
> | clock | 25 | 3985 |
> | glasses | 25 | 3967 |
> | trash | 25 | 3526 |
> | TV | 25 | 4925 |
> | slide (object) | 25 | 4169 |
> | park | 25 | 4473 |
> | brother | 25 | 2918 |
> | sister | 25 | 2973 |
> | call (on phone) | 25 | 4129 |
> | give me five! | 25 | 3675 |
> | nap | 25 | 4541 |
> | pattycake | 25 | 2949 |
> | snack | 25 | 4206 |
> | bite | 25 | 4478 |
> | clap | 25 | 4139 |
> | help | 25 | 4610 |
> | see | 25 | 4267 |
> | tickle | 25 | 4067 |
> | walk | 25 | 4391 |
> | blue | 25 | 4579 |
> | dirty | 25 | 4512 |
> | that | 25 | 3807 |
> | this | 25 | 3543 |
> | what | 25 | 3976 |
> | blockses | 25 | 180 |
> | toeses | 25 | 421 |
> | wented | 25 | 100 |
> | teeths | 25 | 938 |
> | childs | 25 | 140 |
> | mices | 25 | 143 |
> | satted | 25 | 84 |
> | animal | 26 | 3732 |
> | ant | 26 | 3323 |
> | butterfly | 26 | 4371 |
> | deer | 26 | 2727 |
> | giraffe | 26 | 3881 |
> | mouse | 26 | 4183 |
> | squirrel | 26 | 3439 |
> | tiger | 26 | 4039 |
> | zebra | 26 | 3414 |
> | firetruck | 26 | 3850 |
> | stroller | 26 | 3574 |
> | tractor | 26 | 3335 |
> | crayon | 26 | 4209 |
> | pen | 26 | 3624 |
> | puzzle | 26 | 3716 |
> | candy | 26 | 4269 |
> | carrots | 26 | 4004 |
> | coffee | 26 | 3551 |
> | corn | 26 | 3763 |
> | french fries | 26 | 4197 |
> | orange (food) | 26 | 4461 |
> | pancake | 26 | 3816 |
> | peanut butter | 26 | 3502 |
> | popcorn | 26 | 3622 |
> | potato chip | 26 | 3506 |
> | raisin | 26 | 3466 |
> | soup | 26 | 3516 |
> | spaghetti | 26 | 3579 |
> | strawberry | 26 | 4079 |
> | jacket | 26 | 4108 |
> | pajamas | 26 | 4337 |
> | zipper | 26 | 3441 |
> | chin | 26 | 3829 |
> | face | 26 | 4052 |
> | leg | 26 | 4334 |
> | broom | 26 | 3745 |
> | comb | 26 | 3165 |
> | garbage | 26 | 3322 |
> | jar | 26 | 1986 |
> | money | 26 | 3664 |
> | paper | 26 | 4366 |
> | picture | 26 | 3800 |
> | pillow | 26 | 4471 |
> | plate | 26 | 3839 |
> | purse | 26 | 3141 |
> | soap | 26 | 4374 |
> | tissue/kleenex | 26 | 3454 |
> | towel | 26 | 4185 |
> | vacuum | 26 | 3583 |
> | watch (object) | 26 | 3304 |
> | bathroom | 26 | 4104 |
> | couch | 26 | 3689 |
> | high chair | 26 | 3112 |
> | shower | 26 | 3776 |
> | stairs | 26 | 3634 |
> | table | 26 | 4056 |
> | grass | 26 | 4073 |
> | pool | 26 | 4008 |
> | rain | 26 | 4734 |
> | sky | 26 | 3779 |
> | snow | 26 | 3565 |
> | stick | 26 | 3559 |
> | sun | 26 | 4528 |
> | church* | 26 | 2343 |
> | house | 26 | 4392 |
> | school | 26 | 3924 |
> | store | 26 | 3705 |
> | work (place) | 26 | 3636 |
> | aunt | 26 | 3265 |
> | boy | 26 | 4025 |
> | girl | 26 | 3694 |
> | uncle | 26 | 3035 |
> | breakfast | 26 | 3786 |
> | dinner | 26 | 3657 |
> | gonna get you! | 26 | 3587 |
> | go potty | 26 | 4426 |
> | lunch | 26 | 3700 |
> | so big! | 26 | 3015 |
> | blow | 26 | 3761 |
> | clean (action) | 26 | 3929 |
> | close | 26 | 3704 |
> | cry | 26 | 4204 |
> | dance | 26 | 4218 |
> | fall | 26 | 4119 |
> | get | 26 | 3780 |
> | jump | 26 | 4424 |
> | kick | 26 | 3608 |
> | look | 26 | 3935 |
> | love | 26 | 4358 |
> | play | 26 | 4549 |
> | push | 26 | 3635 |
> | read | 26 | 4352 |
> | run | 26 | 4051 |
> | sleep | 26 | 4436 |
> | slide (action) | 26 | 3436 |
> | stop | 26 | 4571 |
> | swing (action) | 26 | 3893 |
> | wash | 26 | 3913 |
> | asleep | 26 | 3483 |
> | big | 26 | 4552 |
> | broken | 26 | 4012 |
> | clean (description) | 26 | 3907 |
> | gentle | 26 | 2592 |
> | good | 26 | 3869 |
> | green | 26 | 3822 |
> | happy | 26 | 3987 |
> | orange (description) | 26 | 3796 |
> | pretty | 26 | 3354 |
> | red | 26 | 3992 |
> | wet | 26 | 4468 |
> | yellow | 26 | 3985 |
> | night | 26 | 3756 |
> | I | 26 | 3858 |
> | my | 26 | 3675 |
> | you | 26 | 3964 |
> | inside/in | 26 | 3862 |
> | do | 26 | 3468 |
> | applesauce | 26 | 3256 |
> | getted | 26 | 181 |
> | feets | 26 | 1149 |
> | foots | 26 | 722 |
> | tooths | 26 | 436 |
> | mittens | 26 | 2466 |
> | blewed | 25 | 136 |
> | camed | 25 | 113 |
> | alligator | 26 | 3127 |
> | donkey | 26 | 2189 |
> | goose | 26 | 2406 |
> | lamb | 26 | 2485 |
> | moose | 26 | 1978 |
> | penguin | 26 | 3041 |
> | pony | 26 | 2213 |
> | rooster | 26 | 2163 |
> | turkey | 26 | 2579 |
> | helicopter | 26 | 3412 |
> | motorcycle | 26 | 3233 |
> | sled | 26 | 1565 |
> | bat | 26 | 2826 |
> | chalk | 26 | 2569 |
> | pencil | 26 | 3004 |
> | play dough | 26 | 2811 |
> | present | 26 | 3112 |
> | story | 26 | 3550 |
> | butter | 26 | 3330 |
> | chocolate | 26 | 3627 |
> | coke | 26 | 1768 |
> | donut | 26 | 2796 |
> | green beans | 26 | 2445 |
> | gum | 26 | 2080 |
> | hamburger | 26 | 3223 |
> | lollipop | 26 | 2502 |
> | meat | 26 | 2859 |
> | melon | 26 | 2362 |
> | muffin | 26 | 3016 |
> | nuts | 26 | 2397 |
> | pickle | 26 | 2718 |
> | popsicle | 26 | 2974 |
> | potato | 26 | 3242 |
> | pretzel | 26 | 2774 |
> | pumpkin | 26 | 3083 |
> | sandwich | 26 | 3432 |
> | sauce | 26 | 2338 |
> | vitamins | 26 | 2268 |
> | beads | 26 | 1703 |
> | belt | 26 | 2521 |
> | dress (object) | 26 | 3192 |
> | gloves | 26 | 2617 |
> | jeans | 26 | 2285 |
> | necklace | 26 | 2932 |
> | shorts | 26 | 3398 |
> | slipper | 26 | 2603 |
> | sneaker | 26 | 1750 |
> | lips | 26 | 3199 |
> | shoulder | 26 | 2593 |
> | basket | 26 | 3102 |
> | bucket | 26 | 2980 |
> | camera | 26 | 3035 |
> | can (object) | 26 | 2160 |
> | dish | 26 | 2466 |
> | glass | 26 | 2968 |
> | hammer | 26 | 2790 |
> | knife | 26 | 3219 |
> | lamp | 26 | 2203 |
> | medicine | 26 | 3504 |
> | mop | 26 | 1767 |
> | napkin | 26 | 3290 |
> | penny | 26 | 2110 |
> | plant | 26 | 2710 |
> | scissors | 26 | 2943 |
> | tape | 26 | 2634 |
> | basement | 26 | 1146 |
> | bedroom | 26 | 3298 |
> | crib | 26 | 3175 |
> | kitchen | 26 | 3844 |
> | oven | 26 | 2600 |
> | rocking chair | 26 | 2420 |
> | refrigerator | 26 | 3052 |
> | room | 26 | 3488 |
> | sink | 26 | 3172 |
> | stove | 26 | 2580 |
> | window | 26 | 3445 |
> | washing machine | 26 | 2491 |
> | backyard | 26 | 2491 |
> | cloud | 26 | 3313 |
> | flag | 26 | 2623 |
> | lawn mower | 26 | 2414 |
> | shovel | 26 | 2942 |
> | snowman | 26 | 2622 |
> | street | 26 | 2995 |
> | wind | 26 | 2988 |
> | beach | 26 | 2908 |
> | farm | 26 | 2388 |
> | party | 26 | 2879 |
> | playground | 26 | 2566 |
> | zoo | 26 | 2878 |
> | doctor | 26 | 3455 |
> | friend | 26 | 2821 |
> | lady | 26 | 2122 |
> | man | 26 | 3003 |
> | people | 26 | 2533 |
> | shopping | 26 | 2856 |
> | this little piggy | 26 | 2617 |
> | turn around | 26 | 2904 |
> | break | 26 | 3357 |
> | bring | 26 | 2699 |
> | carry | 26 | 3127 |
> | catch | 26 | 3234 |
> | climb | 26 | 3133 |
> | cook | 26 | 3321 |
> | draw | 26 | 3221 |
> | drive | 26 | 3248 |
> | drop | 26 | 2890 |
> | find | 26 | 3105 |
> | fix | 26 | 3319 |
> | give | 26 | 3171 |
> | have | 26 | 2971 |
> | hide | 26 | 3274 |
> | hit | 26 | 3524 |
> | hold | 26 | 3255 |
> | knock | 26 | 3008 |
> | pull | 26 | 2873 |
> | ride | 26 | 3492 |
> | shake | 26 | 2561 |
> | share | 26 | 2796 |
> | sing | 26 | 3607 |
> | smile | 26 | 2698 |
> | splash | 26 | 3154 |
> | stand | 26 | 2845 |
> | stay | 26 | 2757 |
> | sweep | 26 | 2689 |
> | swim | 26 | 3543 |
> | throw | 26 | 3521 |
> | touch | 26 | 2993 |
> | wait | 26 | 3010 |
> | watch (action) | 26 | 2944 |
> | wipe | 26 | 3044 |
> | work (action) | 26 | 3112 |
> | awake | 26 | 2961 |
> | bad | 26 | 3379 |
> | black | 26 | 3131 |
> | brown | 26 | 2762 |
> | careful | 26 | 2919 |
> | cute | 26 | 2640 |
> | dark | 26 | 2951 |
> | empty | 26 | 2904 |
> | fast | 26 | 3126 |
> | heavy | 26 | 3405 |
> | hungry | 26 | 3696 |
> | hurt | 26 | 3496 |
> | little (description) | 26 | 3151 |
> | loud | 26 | 2828 |
> | nice | 26 | 3263 |
> | sad | 26 | 2929 |
> | sleepy | 26 | 3201 |
> | soft | 26 | 2896 |
> | sticky | 26 | 2752 |
> | stuck | 26 | 3045 |
> | thirsty | 26 | 2962 |
> | tired | 26 | 3048 |
> | white | 26 | 2837 |
> | windy | 26 | 2517 |
> | morning | 26 | 2757 |
> | now | 26 | 3156 |
> | it | 26 | 2861 |
> | where | 26 | 3360 |
> | why | 26 | 2452 |
> | back | 26 | 2844 |
> | here | 26 | 3390 |
> | there | 26 | 3268 |
> | a | 26 | 2657 |
> | all | 26 | 2805 |
> | some | 26 | 2688 |
> | too | 26 | 2938 |
> | don't | 26 | 2935 |
> | wanna/want to | 26 | 3459 |
> | broke | 26 | 2948 |
> | fell | 26 | 2612 |
> | soda/pop | 26 | 2267 |
> | bump | 26 | 2866 |
> | childrens | 26 | 245 |
> | mans | 26 | 534 |
> | mens | 26 | 185 |
> | falled | 26 | 676 |
> | gotted | 26 | 149 |
> | haved | 26 | 164 |
> | losted | 26 | 170 |
> | seed | 26 | 231 |
> | vagina* | 26 | 1740 |
> | broked | 26 | 664 |
> | doed | 26 | 305 |
> | eated | 26 | 524 |
> | comed | 26 | 178 |
> | heared | 26 | 198 |
> | losed | 26 | 184 |
> | ranned | 26 | 167 |
> | sitted | 26 | 256 |
> | hen | 26 | 1461 |
> | wolf | 26 | 2065 |
> | tricycle | 26 | 1649 |
> | game | 26 | 2837 |
> | jelly | 26 | 2372 |
> | pudding | 26 | 1631 |
> | tuna | 26 | 1400 |
> | radio | 26 | 2042 |
> | drawer | 26 | 2350 |
> | garage | 26 | 2487 |
> | sofa | 26 | 1732 |
> | hose | 26 | 2349 |
> | sandbox | 26 | 2219 |
> | stone | 26 | 1569 |
> | movie | 26 | 2400 |
> | yard | 26 | 2178 |
> | clown | 26 | 2004 |
> | chase | 26 | 2231 |
> | dry (action) | 26 | 2545 |
> | dump | 26 | 1746 |
> | feed | 26 | 2530 |
> | paint | 26 | 2849 |
> | put | 26 | 2628 |
> | say | 26 | 2532 |
> | talk | 26 | 2918 |
> | write | 26 | 2315 |
> | better | 26 | 2446 |
> | dry (description) | 26 | 2736 |
> | high | 26 | 2707 |
> | away | 26 | 2516 |
> | mice | 26 | 712 |
> | tights | 26 | 1174 |
> | finish | 26 | 2422 |
> | flied | 26 | 209 |
> | holded | 26 | 324 |
> | jello | 26 | 1834 |
> | naughty | 26 | 1146 |
> | men | 26 | 737 |
> | goed | 26 | 362 |
> | ated | 26 | 265 |
> | dranked | 26 | 258 |
> | mouses | 26 | 451 |
> | runned | 26 | 358 |
> | glue | 27 | 1606 |
> | salt | 27 | 1897 |
> | vanilla | 27 | 1191 |
> | snowsuit | 27 | 987 |
> | underpants | 27 | 2220 |
> | ankle | 27 | 1532 |
> | nail | 27 | 1984 |
> | tray | 27 | 1098 |
> | bench | 27 | 1413 |
> | closet | 27 | 2807 |
> | dryer | 27 | 2039 |
> | living room | 27 | 2322 |
> | play pen | 27 | 944 |
> | porch | 27 | 1395 |
> | garden | 27 | 1980 |
> | ladder | 27 | 2352 |
> | roof | 27 | 1727 |
> | sidewalk | 27 | 2224 |
> | sprinkler | 27 | 1662 |
> | camping | 27 | 1010 |
> | circus | 27 | 998 |
> | country | 27 | 495 |
> | gas station | 27 | 1736 |
> | picnic | 27 | 1804 |
> | woods | 27 | 942 |
> | babysitter | 27 | 985 |
> | child | 27 | 1372 |
> | cowboy | 27 | 1211 |
> | fireman | 27 | 2171 |
> | mailman | 27 | 1799 |
> | nurse | 27 | 994 |
> | person | 27 | 1135 |
> | police | 27 | 1929 |
> | teacher | 27 | 2231 |
> | build | 27 | 2545 |
> | buy | 27 | 2232 |
> | cover | 27 | 2030 |
> | cut | 27 | 2696 |
> | fit | 27 | 1866 |
> | hate | 27 | 658 |
> | hear | 27 | 2587 |
> | hurry | 27 | 2300 |
> | lick | 27 | 2311 |
> | like | 27 | 3021 |
> | listen | 27 | 2284 |
> | make | 27 | 2567 |
> | pick | 27 | 2155 |
> | pour | 27 | 2064 |
> | rip | 27 | 1414 |
> | show | 27 | 2404 |
> | skate | 27 | 1225 |
> | spill | 27 | 2554 |
> | take | 27 | 2589 |
> | taste | 27 | 2121 |
> | tear | 27 | 1394 |
> | think | 27 | 1390 |
> | wake | 27 | 2565 |
> | fine | 27 | 1382 |
> | first | 27 | 1910 |
> | full | 27 | 2466 |
> | hard | 27 | 2209 |
> | last | 27 | 1114 |
> | long | 27 | 1536 |
> | mad | 27 | 2102 |
> | new | 27 | 2069 |
> | noisy | 27 | 2082 |
> | old | 27 | 1614 |
> | poor | 27 | 789 |
> | quiet | 27 | 2647 |
> | scared | 27 | 2681 |
> | sick | 27 | 2621 |
> | slow | 27 | 1982 |
> | tiny | 27 | 1473 |
> | after | 27 | 1684 |
> | before | 27 | 1028 |
> | day | 27 | 2149 |
> | later | 27 | 2314 |
> | today | 27 | 1821 |
> | tomorrow | 27 | 1851 |
> | tonight | 27 | 1236 |
> | he | 27 | 2080 |
> | her | 27 | 1572 |
> | hers | 27 | 1119 |
> | him | 27 | 1469 |
> | his | 27 | 1389 |
> | she | 27 | 1791 |
> | their | 27 | 840 |
> | them | 27 | 1143 |
> | these | 27 | 1823 |
> | they | 27 | 1180 |
> | those | 27 | 1358 |
> | us | 27 | 910 |
> | we | 27 | 1509 |
> | how | 27 | 1530 |
> | when | 27 | 1090 |
> | which | 27 | 746 |
> | who | 27 | 2155 |
> | about | 27 | 766 |
> | around | 27 | 1528 |
> | at | 27 | 1921 |
> | behind | 27 | 1763 |
> | by | 27 | 1718 |
> | for | 27 | 1749 |
> | next to | 27 | 1248 |
> | of | 27 | 1003 |
> | on top of | 27 | 1760 |
> | over | 27 | 2271 |
> | to | 27 | 2268 |
> | under | 27 | 2637 |
> | with | 27 | 2088 |
> | a lot | 27 | 1874 |
> | another | 27 | 2033 |
> | any | 27 | 1385 |
> | each | 27 | 598 |
> | every | 27 | 977 |
> | much | 27 | 1296 |
> | none | 27 | 1511 |
> | not | 27 | 2159 |
> | other | 27 | 1734 |
> | same | 27 | 1413 |
> | the | 27 | 2370 |
> | am | 27 | 1801 |
> | are | 27 | 1516 |
> | be | 27 | 1408 |
> | can (auxiliary) | 27 | 2286 |
> | could | 27 | 769 |
> | did/did ya | 27 | 2092 |
> | does | 27 | 1173 |
> | gonna/going to | 27 | 2282 |
> | gotta/got to | 27 | 1329 |
> | hafta/have to | 27 | 1631 |
> | is | 27 | 2197 |
> | lemme/let me | 27 | 2680 |
> | need/need to | 27 | 2200 |
> | try/try to | 27 | 2173 |
> | was | 27 | 1134 |
> | were | 27 | 766 |
> | will | 27 | 1246 |
> | would | 27 | 595 |
> | and | 27 | 2565 |
> | so | 27 | 1119 |
> | then | 27 | 959 |
> | children | 27 | 998 |
> | ate | 27 | 2050 |
> | blew | 27 | 980 |
> | bought | 27 | 830 |
> | drank | 27 | 1299 |
> | drove | 27 | 620 |
> | flew | 27 | 769 |
> | got | 27 | 1992 |
> | had | 27 | 1102 |
> | made | 27 | 1563 |
> | ran | 27 | 1367 |
> | sat | 27 | 1200 |
> | took | 27 | 1310 |
> | went | 27 | 1340 |
> | scarf | 27 | 1380 |
> | your | 27 | 1730 |
> | above | 27 | 877 |
> | but | 27 | 1017 |
> | saw | 27 | 1481 |
> | taked | 27 | 380 |
> | into | 27 | 1032 |
> | an | 27 | 666 |
> | came | 27 | 964 |
> | lost | 27 | 1667 |
> | blowed | 27 | 813 |
> | downtown | 27 | 793 |
> | because | 27 | 1324 |
> | time | 27 | 1294 |
> | yourself | 27 | 633 |
> | drinked | 27 | 625 |
> | walker | 27 | 728 |
> | buyed | 27 | 432 |
> | pretend | 27 | 1356 |
> | wish | 27 | 847 |
> | our | 27 | 1012 |
> | if | 27 | 676 |
> | heard | 27 | 915 |
> | held | 27 | 540 |
> | beside | 27 | 885 |
> | bringed | 27 | 439 |
> | myself | 27 | 1328 |
> | yesterday | 27 | 922 |
> | breaked | 27 | 530 |
> | maked | 27 | 338 |


### Code

```nu
# Detailed analysis with statistical measures
open ~/Downloads/wordbank_instrument_data.csv
| where value == "produces"
| group-by item_definition
| items {|word, rows| {
    word: $word,
    first_age: ($rows | get age | math min),
    median_age: ($rows | get age | math median),
    mean_age: ($rows | get age | math avg | math round),
    last_age: ($rows | get age | math max),
    num_children_produced: ($rows | length)
  }}
| sort-by median_age mean_age
| save -f words_by_learning_age.csv
```
