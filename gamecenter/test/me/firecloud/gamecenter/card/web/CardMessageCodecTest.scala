/**
 *
 */
package me.firecloud.gamecenter.card.web

import org.junit._
import Assert._
import me.firecloud.gamecenter.card.model.PutCard

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
        val msg = new PutCard("1",List())
        
        assertEquals("{\"userId\":\"1\",\"cards\":[],\"code\":\"CARD_ACTION_PUT_CARD\"}", codec.encode(msg))
    }
    
    @Test
    def testDecodePutCardAction(){
        // construct json
        val json="{\"userId\":\"1\",\"cards\":[],\"id\":\"1d44c563-31b9-4efc-8ee8-bb1dec47de2a\",\"CLA\":1,\"INS\":1}"
        val msg=codec.decode(json)
        
        assertTrue(msg.isInstanceOf[PutCard])
        val putCardAction = msg.asInstanceOf[PutCard]
        assertEquals("1",putCardAction.userId)
        assertEquals(1,putCardAction.cla)
    }
    

}