/**
 *
 */
package me.firecloud.card.util
import org.junit._

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Oct 19, 2012
 *
 */
@Test
class DynamicTest {
	@Test
	def testPrototype()={
	  var testObject =  SamplePrototype()
	  testObject.a=1
	  assertEqual(1,testObject.a)
	}
}