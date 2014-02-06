/**
 *
 */
package me.firecloud.gamecenter.card.web

import org.junit._
import Assert._
import me.firecloud.gamecenter.card.model.PutCardAction
import me.firecloud.gamecenter.card.model.PassAction

/**
 * @author kkppccdd
 * @email kkppccdd@gmail.com
 * @date Jan 4, 2014
 *
 */
class CardMessageCodecTest {
    
    val codec = new CardMessageCodec() 

    @Test
    def testEncodePutCardAction(){
        
        // construct action
        val msg = new PutCardAction("1",List())
        
        assertEquals("{\"userId\":\"1\",\"cards\":[],\"code\":\"CARD_ACTION_PUT_CARD\"}", codec.encode(msg))
    }
    
    @Test
    def testDecodePutCardAction(){
        // construct json
        val json="{\"code\":\"CARD_ACTION_PUT_CARD\",\"userId\":\"1\",\"cards\":[]}"
        val msg=codec.decode(json)
        
        assertTrue(msg.isInstanceOf[PutCardAction])
        val putCardAction = msg.asInstanceOf[PutCardAction]
        assertEquals("1",putCardAction.userId)
        assertEquals(PutCardAction.code,putCardAction.code)
    }
    
    @Test
    def testEncodePassAction() {
        // construct action
        val msg =new PassAction("1")
        
        assertEquals("{\"userId\":\"1\",\"code\":\"CARD_ACTION_PASS\"}",codec.encode(msg))
    }
    
    @Test
    def testDecodePassAction(){
        // construct json
        
        val json="{\"userId\":\"1\",\"code\":\"CARD_ACTION_PASS\"}"
        val msg=codec.decode(json)
        
        assertTrue(msg.isInstanceOf[PassAction])
        val passAction = msg.asInstanceOf[PassAction]
        assertEquals("1",passAction.userId)
        assertEquals(PassAction.code,passAction.code)
        
    }
}