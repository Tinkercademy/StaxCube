#include <FastLED.h>
#include <colorutils.h>

#define NUM_LEDS 16 //Number of LEDs testing
#define NUM_STRIPS 4

#define LED_TYPE PL9823
CRGB leds[NUM_LEDS][NUM_STRIPS]; 
void setup() {
  FastLED.addLeds<PL9823, 12>(leds[0], NUM_LEDS);
  FastLED.addLeds<PL9823, 14>(leds[1], NUM_LEDS);
  FastLED.addLeds<PL9823, 4>(leds[2], NUM_LEDS);
  FastLED.addLeds<PL9823, 15>(leds[3], NUM_LEDS);
  }

long iters = 0;
void loop() {
  //Below is self explanatory probably.
  fill_rainbow(leds[0],NUM_LEDS,(iters*2)%360,(int)360/16);
  fill_rainbow(leds[1],NUM_LEDS,(iters*2)%360,(int)360/16);
  fill_rainbow(leds[2],NUM_LEDS,(iters*2)%360,(int)360/16);
  fill_rainbow(leds[3],NUM_LEDS,(iters*2)%360,(int)360/16);
  FastLED.show(); //This updates the changes made to the LEDs
  iters++;
  delay(15);
}
