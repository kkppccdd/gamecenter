/**
 * 
 */
package me.firecloud.game.util;

import static org.junit.Assert.*;

import java.util.HashMap;
import java.util.LinkedList;
import java.util.Map;

import ognl.Ognl;
import ognl.OgnlContext;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

/**
 * @date 2012-10-12
 * 
 */
public class OgnlTest {

  /**
   * @throws java.lang.Exception
   */
  @Before
  public
      void setUp() throws Exception {
  }

  /**
   * @throws java.lang.Exception
   */
  @After
  public
      void tearDown() throws Exception {
  }

  @Test
  public
      void test() throws Exception {
    OgnlContext ctx = new OgnlContext();
    ctx.setRoot(new HashMap<String, Object>());

    Ognl.setValue("a", ctx.getRoot(), new HashMap<String, Object>());
    //assertEquals(112345, Ognl.getValue("a", ctx.getRoot()));
    
    Ognl.setValue("a.b", ctx.getRoot(), new LinkedList<Object>());
    Ognl.setValue("a.b[0]", ctx.getRoot(), 11234598);
    assertEquals(11234598, Ognl.getValue("a.b[0]", ctx.getRoot()));
  }

}
