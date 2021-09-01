package com.podchoosee;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.zoontek.rnbootsplash.RNBootSplash;
import com.rnimmersivebars.ImmersiveBars;

public class MainActivity extends ReactActivity {

  @Override 
  protected void onCreate(Bundle savedInstanceState) {
    RNBootSplash.init(R.drawable.bootsplash, MainActivity.this);
    ImmersiveBars.changeBarColors(this, true);
    super.onCreate(savedInstanceState);
  }

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "Podchoosee";
  }
}
